from html import escape
import logging
from pathlib import PurePath
import re
from uuid import uuid4

from fastapi import APIRouter, BackgroundTasks, File, Form, HTTPException, UploadFile
from pydantic import ValidationError

from app.core.config import settings
from app.schemas.submissions import ContactSubmission, SubmissionAccepted
from app.services.email_service import (
    EmailAttachment,
    format_career_email,
    format_contact_email,
    format_submission_confirmation,
    send_email,
)

router = APIRouter()
logger = logging.getLogger(__name__)
ALLOWED_CV_TYPES = {
    ".pdf": "application/pdf",
    ".doc": "application/msword",
    ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
}
MAX_TEXT_LENGTH = 5000


def _require_mail_configuration() -> None:
    if not settings.mail_is_configured:
        raise HTTPException(
            status_code=503,
            detail="Email delivery is not configured. Please contact Sinnchem directly.",
        )


def _clean_text(value: str, field: str, max_length: int = 500) -> str:
    cleaned = value.strip()
    if not cleaned:
        raise HTTPException(status_code=422, detail=f"{field} is required.")
    if any(ord(character) < 32 or ord(character) == 127 for character in cleaned):
        raise HTTPException(
            status_code=422,
            detail=f"{field} must not contain control characters.",
        )
    if len(cleaned) > max_length:
        raise HTTPException(status_code=422, detail=f"{field} is too long.")
    return cleaned


def _validate_email(value: str) -> str:
    email = value.strip()
    if len(email) > 254 or not re.fullmatch(r"[^\s@]+@[^\s@]+\.[^\s@]+", email):
        raise HTTPException(status_code=422, detail="A valid email address is required.")
    return email


@router.post("/contact", response_model=SubmissionAccepted, status_code=202)
async def submit_contact(
    submission: ContactSubmission,
    background_tasks: BackgroundTasks,
) -> SubmissionAccepted:
    _require_mail_configuration()
    reference_id = uuid4().hex[:12].upper()
    email = format_contact_email(
        name=submission.name,
        company=submission.company,
        email=submission.email,
        phone=submission.phone,
        interest=submission.interest,
        requirement=submission.requirement,
        reference_id=reference_id,
    )
    background_tasks.add_task(send_email, email)
    background_tasks.add_task(
        send_email,
        format_submission_confirmation(
            name=submission.name,
            email=submission.email,
            reference_id=reference_id,
            submission_type="business enquiry",
        ),
    )
    return SubmissionAccepted(
        message="Your enquiry was accepted for delivery.", reference_id=reference_id
    )


@router.post("/careers", response_model=SubmissionAccepted, status_code=202)
async def submit_career_application(
    background_tasks: BackgroundTasks,
    name: str = Form(..., min_length=2, max_length=120),
    email: str = Form(...),
    phone: str = Form(..., min_length=5, max_length=40),
    role: str = Form(..., min_length=2, max_length=160),
    education: str = Form(..., min_length=2, max_length=120),
    discipline: str = Form(..., min_length=2, max_length=160),
    experience_years: float = Form(..., ge=0, le=60),
    city: str = Form(..., min_length=2, max_length=160),
    note: str = Form(default="", max_length=MAX_TEXT_LENGTH),
    cv: UploadFile = File(...),
) -> SubmissionAccepted:
    _require_mail_configuration()
    clean_email = _validate_email(email)
    clean_name = _clean_text(name, "Name", 120)
    clean_phone = _clean_text(phone, "Phone", 40)
    clean_role = _clean_text(role, "Role", 160)
    clean_education = _clean_text(education, "Education", 120)
    clean_discipline = _clean_text(discipline, "Discipline", 160)
    clean_city = _clean_text(city, "City", 160)
    clean_note = note.strip()
    if len(clean_note) > MAX_TEXT_LENGTH:
        raise HTTPException(status_code=422, detail="Note is too long.")

    extension = PurePath(cv.filename or "").suffix.lower()
    expected_content_type = ALLOWED_CV_TYPES.get(extension)
    if not expected_content_type:
        raise HTTPException(
            status_code=422, detail="CV must be a PDF, DOC, or DOCX file."
        )
    if cv.content_type and cv.content_type not in {
        expected_content_type,
        "application/octet-stream",
    }:
        raise HTTPException(status_code=422, detail="CV file type does not match its extension.")

    content = await cv.read(settings.max_cv_size_bytes + 1)
    await cv.close()
    if not content:
        raise HTTPException(status_code=422, detail="CV file cannot be empty.")
    if len(content) > settings.max_cv_size_bytes:
        raise HTTPException(status_code=413, detail="CV file exceeds the 5 MB limit.")

    safe_basename = PurePath(cv.filename or "candidate-cv").name
    safe_filename = re.sub(r"[^A-Za-z0-9._-]", "_", safe_basename)[:120]
    safe_filename = safe_filename or "candidate-cv" + extension
    attachment = EmailAttachment(
        filename=safe_filename,
        content_type=expected_content_type,
        content=content,
    )
    reference_id = uuid4().hex[:12].upper()
    email_message = format_career_email(
        name=clean_name,
        email=clean_email,
        phone=clean_phone,
        role=clean_role,
        education=clean_education,
        discipline=clean_discipline,
        experience_years=experience_years,
        city=clean_city,
        note=clean_note,
        reference_id=reference_id,
        attachment=attachment,
    )
    background_tasks.add_task(send_email, email_message)
    background_tasks.add_task(
        send_email,
        format_submission_confirmation(
            name=clean_name,
            email=clean_email,
            reference_id=reference_id,
            submission_type="career application",
        ),
    )
    return SubmissionAccepted(
        message="Your application was accepted for delivery.", reference_id=reference_id
    )
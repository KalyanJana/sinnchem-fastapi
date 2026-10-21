import logging
import smtplib
import ssl
from dataclasses import dataclass
from email.message import EmailMessage
from email.utils import formataddr
from html import escape

from app.core.config import settings

logger = logging.getLogger(__name__)


@dataclass(frozen=True)
class EmailAttachment:
    filename: str
    content_type: str
    content: bytes


@dataclass(frozen=True)
class OutgoingEmail:
    subject: str
    reply_to: str
    text_body: str
    html_body: str
    attachment: EmailAttachment | None = None
    to: str | None = None


def send_email(email: OutgoingEmail) -> None:
    message = EmailMessage()
    message["Subject"] = email.subject
    message["From"] = formataddr((settings.mail_from_name, settings.mail_from))
    message["To"] = email.to or settings.mail_to
    message["Reply-To"] = email.reply_to
    message.set_content(email.text_body)
    message.add_alternative(email.html_body, subtype="html")

    if email.attachment:
        maintype, subtype = email.attachment.content_type.split("/", maxsplit=1)
        message.add_attachment(
            email.attachment.content,
            maintype=maintype,
            subtype=subtype,
            filename=email.attachment.filename,
        )

    try:
        context = ssl.create_default_context()
        if settings.mail_port == 465:
            with smtplib.SMTP_SSL(
                settings.mail_host, settings.mail_port, context=context, timeout=20
            ) as smtp:
                smtp.login(settings.mail_username, settings.mail_password)
                smtp.send_message(message)
            return

        with smtplib.SMTP(settings.mail_host, settings.mail_port, timeout=20) as smtp:
            smtp.ehlo()
            if settings.mail_use_starttls:
                smtp.starttls(context=context)
                smtp.ehlo()
            smtp.login(settings.mail_username, settings.mail_password)
            smtp.send_message(message)
    except Exception:
        logger.exception("SMTP delivery failed for website submission")


def format_contact_email(
    *,
    name: str,
    company: str,
    email: str,
    phone: str,
    interest: str,
    requirement: str,
    reference_id: str,
) -> OutgoingEmail:
    fields = [
        ("Name", name),
        ("Company", company or "Not provided"),
        ("Email", email),
        ("Phone", phone or "Not provided"),
        ("Area of interest", interest or "Not selected"),
    ]
    text_rows = "\n".join(f"{label}: {value}" for label, value in fields)
    html_rows = "".join(
        f'<tr><th align="left">{escape(label)}</th><td>{escape(value)}</td></tr>'
        for label, value in fields
    )
    return OutgoingEmail(
        subject=f"Website business enquiry [{reference_id}]",
        reply_to=email,
        text_body=(
            f"Business enquiry from the Sinnchem website\nReference: {reference_id}\n\n"
            f"{text_rows}\n\nRequirement:\n{requirement}"
        ),
        html_body=(
            "<html><body><h2>Business enquiry</h2>"
            f"<p>Reference: <strong>{escape(reference_id)}</strong></p>"
            f"<table>{html_rows}</table>"
            f"<h3>Requirement</h3><p>{escape(requirement).replace(chr(10), '<br>')}</p>"
            "</body></html>"
        ),
    )


def format_career_email(
    *,
    name: str,
    email: str,
    phone: str,
    role: str,
    education: str,
    discipline: str,
    experience_years: float,
    city: str,
    note: str,
    reference_id: str,
    attachment: EmailAttachment,
) -> OutgoingEmail:
    fields = [
        ("Name", name),
        ("Email", email),
        ("Phone", phone),
        ("Role", role),
        ("Highest qualification", education),
        ("Specialization", discipline),
        ("Industry experience (years)", str(experience_years)),
        ("Current city", city),
    ]
    text_rows = "\n".join(f"{label}: {value}" for label, value in fields)
    html_rows = "".join(
        f'<tr><th align="left">{escape(label)}</th><td>{escape(value)}</td></tr>'
        for label, value in fields
    )
    return OutgoingEmail(
        subject=f"Career application: {role} [{reference_id}]",
        reply_to=email,
        text_body=(
            f"Career application from the Sinnchem website\nReference: {reference_id}\n\n"
            f"{text_rows}\n\nNote:\n{note or 'Not provided'}\n\n"
            f"CV attached: {attachment.filename}"
        ),
        html_body=(
            "<html><body><h2>Career application</h2>"
            f"<p>Reference: <strong>{escape(reference_id)}</strong></p>"
            f"<table>{html_rows}</table>"
            f"<h3>Candidate note</h3><p>{escape(note or 'Not provided')}</p>"
            f"<p>CV attached: {escape(attachment.filename)}</p>"
            "</body></html>"
        ),
        attachment=attachment,
    )


def format_submission_confirmation(
    *, name: str, email: str, reference_id: str, submission_type: str
) -> OutgoingEmail:
    return OutgoingEmail(
        subject=f"We received your {submission_type} [{reference_id}]",
        reply_to=settings.mail_from,
        text_body=(
            f"Hello {name},\n\n"
            f"We received your {submission_type}. Sinnchem's team will review it "
            "and follow up with you.\n\n"
            f"Reference: {reference_id}\n\nSinnchem Life Sciences"
        ),
        html_body=(
            "<html><body>"
            f"<p>Hello {escape(name)},</p>"
            f"<p>We received your {escape(submission_type)}. Sinnchem's team "
            "will review it and follow up with you.</p>"
            f"<p>Reference: <strong>{escape(reference_id)}</strong></p>"
            "<p>Sinnchem Life Sciences</p></body></html>"
        ),
        to=email,
    )

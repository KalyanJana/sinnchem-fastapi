from dataclasses import replace

from app.api import routes
from app.core.config import Settings
from app.main import app
from app.services import email_service
from app.services.email_service import EmailAttachment, OutgoingEmail
from fastapi.testclient import TestClient

client = TestClient(app)


def _configured_settings(**overrides: object) -> Settings:
    values: dict[str, object] = {
        "app_env": "test",
        "mail_host": "smtp.test.local",
        "mail_port": 587,
        "mail_username": "sender",
        "mail_password": "not-a-real-secret",
        "mail_from": "website@sinnchem.test",
        "mail_from_name": "Sinnchem Website",
        "mail_to": "info@sinnchem.com",
        "mail_use_starttls": True,
        "max_cv_size_bytes": 5 * 1024 * 1024,
    }
    values.update(overrides)
    return replace(routes.settings, **values)


def _configure_mail(monkeypatch, **overrides: object) -> None:
    monkeypatch.setattr(routes, "settings", _configured_settings(**overrides))


def test_settings_load_mail_server_and_sender_name(monkeypatch) -> None:
    monkeypatch.setenv("MAIL_SERVER", "smtp.env.test")
    monkeypatch.setenv("MAIL_PORT", "465")
    monkeypatch.setenv("MAIL_USERNAME", "sender@example.com")
    monkeypatch.setenv("MAIL_PASSWORD", "test-password")
    monkeypatch.setenv("MAIL_FROM_NAME", "Sinnchem")
    monkeypatch.delenv("MAIL_HOST", raising=False)
    monkeypatch.delenv("MAIL_FROM", raising=False)

    settings = Settings.from_environment()

    assert settings.mail_host == "smtp.env.test"
    assert settings.mail_port == 465
    assert settings.mail_from == "sender@example.com"
    assert settings.mail_from_name == "Sinnchem"


def test_health() -> None:
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_root() -> None:
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["health"] == "/health"
    assert response.json()["docs"] == "/docs"


def test_contact_accepts_and_queues_formatted_email(monkeypatch) -> None:
    _configure_mail(monkeypatch)
    queued: list[OutgoingEmail] = []
    monkeypatch.setattr(routes, "send_email", queued.append)

    response = client.post(
        "/api/contact",
        json={
            "name": "Asha Rao",
            "company": "Example Pharma",
            "email": "asha@example.com",
            "phone": "+919876543210",
            "interest": "Pharmaceutical Chemical",
            "requirement": "Please share product availability and specification.",
        },
    )

    assert response.status_code == 202
    assert response.json()["reference_id"]
    assert len(queued) == 2
    assert queued[0].reply_to == "asha@example.com"
    assert "Asha Rao" in queued[0].text_body
    assert "Example Pharma" in queued[0].html_body
    assert queued[1].to == "asha@example.com"
    assert response.json()["reference_id"] in queued[1].text_body


def test_contact_requires_email_configuration(monkeypatch) -> None:
    monkeypatch.setattr(routes, "settings", _configured_settings(mail_host=""))
    response = client.post(
        "/api/contact",
        json={
            "name": "Asha Rao",
            "email": "asha@example.com",
            "requirement": "Please share product availability.",
        },
    )
    assert response.status_code == 503


def test_contact_rejects_invalid_email() -> None:
    response = client.post(
        "/api/contact",
        json={
            "name": "Asha Rao",
            "email": "invalid-email",
            "requirement": "Please share product availability.",
        },
    )
    assert response.status_code == 422


def test_contact_rejects_missing_required_fields(monkeypatch) -> None:
    _configure_mail(monkeypatch)
    response = client.post(
        "/api/contact",
        json={"name": "Asha Rao", "email": "asha@example.com"},
    )
    assert response.status_code == 422


def _career_form_data() -> dict[str, str]:
    return {
        "name": "Ravi Kumar",
        "email": "ravi@example.com",
        "phone": "+919876543210",
        "role": "Research Associate",
        "education": "M.Sc.",
        "discipline": "Organic Chemistry",
        "experience_years": "1.5",
        "city": "Hyderabad, Telangana",
        "note": "Interested in synthesis projects.",
    }


def test_career_application_queues_email_with_cv(monkeypatch) -> None:
    _configure_mail(monkeypatch)
    queued: list[OutgoingEmail] = []
    monkeypatch.setattr(routes, "send_email", queued.append)

    response = client.post(
        "/api/careers",
        data=_career_form_data(),
        files={"cv": ("ravi-cv.pdf", b"%PDF-test-content", "application/pdf")},
    )

    assert response.status_code == 202
    assert len(queued) == 2
    assert queued[0].subject.startswith("Career application: Research Associate")
    assert queued[0].reply_to == "ravi@example.com"
    assert queued[0].attachment == EmailAttachment(
        filename="ravi-cv.pdf",
        content_type="application/pdf",
        content=b"%PDF-test-content",
    )
    assert queued[1].to == "ravi@example.com"
    assert response.json()["reference_id"] in queued[1].text_body


def test_career_rejects_unsupported_cv(monkeypatch) -> None:
    _configure_mail(monkeypatch)
    response = client.post(
        "/api/careers",
        data=_career_form_data(),
        files={"cv": ("ravi-cv.txt", b"not a CV format", "text/plain")},
    )
    assert response.status_code == 422


def test_career_rejects_oversized_cv(monkeypatch) -> None:
    _configure_mail(monkeypatch)
    monkeypatch.setattr(
        routes,
        "settings",
        _configured_settings(max_cv_size_bytes=8),
    )
    response = client.post(
        "/api/careers",
        data=_career_form_data(),
        files={"cv": ("ravi-cv.pdf", b"%PDF-file-is-too-large", "application/pdf")},
    )
    assert response.status_code == 413


def test_career_rejects_bad_email(monkeypatch) -> None:
    _configure_mail(monkeypatch)
    data = _career_form_data()
    data["email"] = "not-an-email"
    response = client.post(
        "/api/careers",
        data=data,
        files={"cv": ("ravi-cv.pdf", b"%PDF-test", "application/pdf")},
    )
    assert response.status_code == 422


def test_career_rejects_control_characters_in_role(monkeypatch) -> None:
    _configure_mail(monkeypatch)
    data = _career_form_data()
    data["role"] = "Research Associate\r\nBcc: attacker@example.com"

    response = client.post(
        "/api/careers",
        data=data,
        files={"cv": ("ravi-cv.pdf", b"%PDF-test", "application/pdf")},
    )

    assert response.status_code == 422


def test_career_rejects_cv_content_type_mismatch(monkeypatch) -> None:
    _configure_mail(monkeypatch)
    response = client.post(
        "/api/careers",
        data=_career_form_data(),
        files={"cv": ("ravi-cv.pdf", b"not a pdf", "text/plain")},
    )
    assert response.status_code == 422


def test_career_requires_cv(monkeypatch) -> None:
    _configure_mail(monkeypatch)
    response = client.post("/api/careers", data=_career_form_data())
    assert response.status_code == 422


def test_career_requires_email_configuration(monkeypatch) -> None:
    monkeypatch.setattr(routes, "settings", _configured_settings(mail_host=""))
    response = client.post(
        "/api/careers",
        data=_career_form_data(),
        files={"cv": ("ravi-cv.pdf", b"%PDF-test", "application/pdf")},
    )
    assert response.status_code == 503


def test_career_sanitizes_cv_filename(monkeypatch) -> None:
    _configure_mail(monkeypatch)
    queued: list[OutgoingEmail] = []
    monkeypatch.setattr(routes, "send_email", queued.append)

    response = client.post(
        "/api/careers",
        data=_career_form_data(),
        files={"cv": ("candidate final.pdf", b"%PDF-test", "application/pdf")},
    )

    assert response.status_code == 202
    assert queued[0].attachment is not None
    assert queued[0].attachment.filename == "candidate_final.pdf"


def test_smtp_sender_builds_multipart_email_and_uses_starttls(monkeypatch) -> None:
    sent_messages = []
    calls: list[tuple[str, tuple[object, ...]]] = []

    class FakeSMTP:
        def __init__(self, *args, **kwargs) -> None:
            calls.append(("init", args))

        def __enter__(self):
            return self

        def __exit__(self, *args) -> None:
            return None

        def ehlo(self) -> None:
            calls.append(("ehlo", ()))

        def starttls(self, **kwargs) -> None:
            calls.append(("starttls", ()))

        def login(self, username, password) -> None:
            calls.append(("login", (username, password)))

        def send_message(self, message) -> None:
            sent_messages.append(message)

    monkeypatch.setattr(email_service, "settings", _configured_settings())
    monkeypatch.setattr(email_service.smtplib, "SMTP", FakeSMTP)
    message = OutgoingEmail(
        subject="Website enquiry",
        reply_to="buyer@example.com",
        text_body="Plain text content",
        html_body="<p>HTML content</p>",
    )

    email_service.send_email(message)

    assert len(sent_messages) == 1
    sent = sent_messages[0]
    assert sent["To"] == "info@sinnchem.com"
    assert sent["Reply-To"] == "buyer@example.com"
    assert (
        sent.get_body(preferencelist=("plain",)).get_content().strip()
        == "Plain text content"
    )
    assert (
        sent.get_body(preferencelist=("html",)).get_content().strip()
        == "<p>HTML content</p>"
    )
    assert [name for name, _ in calls].count("starttls") == 1
    assert "not-a-real-secret" in calls[-1][1]


def test_smtp_delivery_failure_does_not_escape_or_log_password(
    monkeypatch, caplog
) -> None:
    class FailingSMTP:
        def __init__(self, *args, **kwargs) -> None:
            pass

        def __enter__(self):
            return self

        def __exit__(self, *args) -> None:
            return None

        def ehlo(self) -> None:
            pass

        def starttls(self, **kwargs) -> None:
            raise RuntimeError("temporary SMTP outage")

    monkeypatch.setattr(email_service, "settings", _configured_settings())
    monkeypatch.setattr(email_service.smtplib, "SMTP", FailingSMTP)

    email_service.send_email(
        OutgoingEmail("Subject", "person@example.com", "body", "<p>body</p>")
    )

    assert "SMTP delivery failed" in caplog.text
    assert "not-a-real-secret" not in caplog.text

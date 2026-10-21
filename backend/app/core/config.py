import os
from dataclasses import dataclass
from pathlib import Path

from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parents[2] / ".env")


def _read_bool(name: str, default: bool) -> bool:
    value = os.getenv(name)
    if value is None:
        return default
    return value.strip().lower() in {"1", "true", "yes", "on"}


@dataclass(frozen=True)
class Settings:
    app_env: str
    cors_origins: tuple[str, ...]
    mail_host: str
    mail_port: int
    mail_username: str
    mail_password: str
    mail_from: str
    mail_from_name: str
    mail_to: str
    mail_use_starttls: bool
    max_cv_size_bytes: int

    @classmethod
    def from_environment(cls) -> "Settings":
        origins = os.getenv("CORS_ORIGINS", "http://localhost:5173")
        return cls(
            app_env=os.getenv("APP_ENV", "development"),
            cors_origins=tuple(
                origin.strip() for origin in origins.split(",") if origin.strip()
            ),
            mail_host=os.getenv("MAIL_SERVER", os.getenv("MAIL_HOST", "")),
            mail_port=int(os.getenv("MAIL_PORT", "587")),
            mail_username=os.getenv("MAIL_USERNAME", ""),
            mail_password=os.getenv("MAIL_PASSWORD", ""),
            mail_from=os.getenv("MAIL_FROM", os.getenv("MAIL_USERNAME", "")),
            mail_from_name=os.getenv("MAIL_FROM_NAME", "Sinnchem Website"),
            mail_to=os.getenv("MAIL_TO", "info@sinnchem.com"),
            mail_use_starttls=_read_bool("MAIL_USE_STARTTLS", True),
            max_cv_size_bytes=int(os.getenv("MAX_CV_SIZE_BYTES", "5242880")),
        )

    @property
    def mail_is_configured(self) -> bool:
        return all(
            (
                self.mail_host,
                self.mail_username,
                self.mail_password,
                self.mail_from,
                self.mail_to,
            )
        )


settings = Settings.from_environment()

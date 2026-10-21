from pydantic import BaseModel, ConfigDict, Field


class ContactSubmission(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    name: str = Field(min_length=2, max_length=120)
    company: str = Field(default="", max_length=160)
    email: str = Field(
        min_length=3,
        max_length=254,
        pattern=r"^[^\s@]+@[^\s@]+\.[^\s@]+$",
    )
    phone: str = Field(default="", max_length=40)
    interest: str = Field(default="", max_length=120)
    requirement: str = Field(min_length=5, max_length=5000)


class SubmissionAccepted(BaseModel):
    message: str
    reference_id: str

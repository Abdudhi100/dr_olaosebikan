import shutil
import tempfile

from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase, override_settings
from django.urls import reverse

from .models import Publication


User = get_user_model()
TEMP_MEDIA_ROOT = tempfile.mkdtemp()


@override_settings(MEDIA_ROOT=TEMP_MEDIA_ROOT)
class PublicationCreateTests(TestCase):
    @classmethod
    def tearDownClass(cls):
        super().tearDownClass()
        shutil.rmtree(TEMP_MEDIA_ROOT, ignore_errors=True)

    def setUp(self):
        self.doctor = User.objects.create_user(
            username="doctor",
            password="testpass123",
            role=User.ROLE_DOCTOR,
        )
        self.patient = User.objects.create_user(
            username="patient",
            password="testpass123",
            role=User.ROLE_PATIENT,
        )

    def test_doctor_can_create_publication_with_pdf(self):
        self.client.force_login(self.doctor)
        uploaded_pdf = SimpleUploadedFile(
            "paper.pdf",
            b"%PDF-1.4\n% test pdf\n",
            content_type="application/pdf",
        )

        response = self.client.post(
            reverse("publications:publication_create"),
            {
                "title": "Clinical Patterns in Rheumatology",
                "journal": "Journal of Rheumatology",
                "year": 2026,
                "authors": "Dr Test",
                "abstract": "A short abstract.",
                "doi_link": "https://example.com/paper",
                "pdf": uploaded_pdf,
                "is_published": "on",
            },
        )

        publication = Publication.objects.get()
        self.assertRedirects(response, reverse("accounts:doctor-dashboard"))
        self.assertEqual(publication.doctor, self.doctor)
        self.assertTrue(publication.pdf.name.startswith("publications/pdfs/"))

    def test_patient_cannot_create_publication(self):
        self.client.force_login(self.patient)

        response = self.client.get(reverse("publications:publication_create"))

        self.assertEqual(response.status_code, 403)

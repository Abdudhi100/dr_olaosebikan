from pathlib import Path

from django import forms

from .models import Publication


class PublicationForm(forms.ModelForm):
    class Meta:
        model = Publication
        fields = [
            "title",
            "journal",
            "year",
            "authors",
            "abstract",
            "doi_link",
            "pdf",
            "is_featured",
            "is_published",
        ]
        widgets = {
            "abstract": forms.Textarea(attrs={"rows": 5}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        text_input_class = (
            "mt-2 block w-full rounded-xl border border-slate-300 px-4 py-3 "
            "text-slate-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        )
        checkbox_class = "h-5 w-5 rounded border-slate-300 text-blue-700 focus:ring-blue-500"

        for field_name in ["title", "journal", "year", "authors", "abstract", "doi_link"]:
            self.fields[field_name].widget.attrs.setdefault("class", text_input_class)

        self.fields["pdf"].widget.attrs.setdefault(
            "class",
            "block w-full text-sm text-slate-600 file:mr-4 file:rounded-full "
            "file:border-0 file:bg-blue-700 file:px-5 file:py-2.5 file:text-sm "
            "file:font-semibold file:text-white hover:file:bg-blue-600",
        )
        self.fields["pdf"].widget.attrs.setdefault("accept", "application/pdf,.pdf")

        self.fields["is_featured"].widget.attrs.setdefault("class", checkbox_class)
        self.fields["is_published"].widget.attrs.setdefault("class", checkbox_class)

    def clean_pdf(self):
        pdf = self.cleaned_data.get("pdf")
        if not pdf:
            return pdf

        extension = Path(pdf.name).suffix.lower()
        if extension != ".pdf":
            raise forms.ValidationError("Upload a PDF file.")

        if getattr(pdf, "content_type", "") not in {"application/pdf", "application/x-pdf"}:
            raise forms.ValidationError("Upload a valid PDF file.")

        max_size = 10 * 1024 * 1024
        if pdf.size > max_size:
            raise forms.ValidationError("PDF file size must be 10 MB or less.")

        return pdf

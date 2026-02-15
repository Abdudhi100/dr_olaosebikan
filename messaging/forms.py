from django import forms


class WhatsAppMessageForm(forms.Form):
    patient_name = forms.CharField(max_length=255)
    phone = forms.CharField(max_length=20)
    message = forms.CharField(
        widget=forms.Textarea(attrs={"rows": 4}),
        required=False,
    )
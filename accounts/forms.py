# accounts/forms.py
from django import forms
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth import get_user_model

User = get_user_model()

BASE_INPUT_CLASSES = (
    "w-full rounded-lg border border-gray-300 px-4 py-2 "
    "focus:outline-none focus:ring-2 focus:ring-blue-500"
)

class UserRegisterForm(UserCreationForm):
    email = forms.EmailField(
        required=True,
        widget=forms.EmailInput(attrs={"class": BASE_INPUT_CLASSES})
    )

    role = forms.ChoiceField(
        choices=User.ROLE_CHOICES,
        widget=forms.Select(attrs={"class": BASE_INPUT_CLASSES})
    )

    class Meta:
        model = User
        fields = ("username", "email", "role", "password1", "password2")

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        for field in ["username", "password1", "password2"]:
            self.fields[field].widget.attrs["class"] = BASE_INPUT_CLASSES


class StyledAuthenticationForm(AuthenticationForm):
    username = forms.CharField(
        widget=forms.TextInput(attrs={"class": BASE_INPUT_CLASSES})
    )
    password = forms.CharField(
        widget=forms.PasswordInput(attrs={"class": BASE_INPUT_CLASSES})
    )

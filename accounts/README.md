# Accounts App (Django)

A robust authentication, authorization, and role-based dashboard system for a medical appointment platform. This app handles **user registration, login, role management (Doctor / Patient), dashboards, and security-related workflows**.

---

## 📌 Overview

The `accounts` app is responsible for:

* Custom user model with roles
* User registration and authentication
* Role-based dashboard redirection
* Doctor and patient dashboards
* Password management (change)
* Secure session handling

It is designed to be **scalable**, **production-ready**, and easily extensible for healthcare platforms or SaaS systems.

---

## 🏗️ Architecture Summary

```
accounts/
├── models.py
├── forms.py
├── views.py
├── urls.py
├── templates/
│   └── accounts/
│       ├── register.html
│       ├── login.html
│       ├── password_change.html
│       ├── password_change_done.html
│       └── dashboards/
│           ├── base_dashboard.html
│           ├── doctor_dashboard.html
│           └── patient_dashboard.html
```

---

## 👤 Custom User Model

### File: `models.py`

The app uses a **custom user model** extending Django’s `AbstractUser`.

### Features

* Role-based system (`Doctor`, `Patient`)
* Clean role helpers for permissions

```python
class User(AbstractUser):
    ROLE_DOCTOR = "doctor"
    ROLE_PATIENT = "patient"

    ROLE_CHOICES = [
        (ROLE_DOCTOR, "Doctor"),
        (ROLE_PATIENT, "Patient"),
    ]

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default=ROLE_PATIENT)
```

### Helper Properties

```python
@property
def is_doctor(self):
    return self.role == self.ROLE_DOCTOR
```

These helpers are used across views and templates for **authorization and UI logic**.

---

## 📝 Forms

### File: `forms.py`

#### 1. User Registration Form

* Extends `UserCreationForm`
* Adds email and role selection
* TailwindCSS-compatible widgets

```python
class UserRegisterForm(UserCreationForm):
    email = forms.EmailField(required=True)
    role = forms.ChoiceField(choices=User.ROLE_CHOICES)
```

#### 2. Styled Authentication Form

Used for login with consistent Tailwind styling.

```python
class StyledAuthenticationForm(AuthenticationForm):
    username = forms.CharField(...)
    password = forms.CharField(...)
```

---

## 🔐 Authentication & Views

### File: `views.py`

### Registration Flow

```python
class RegisterView(CreateView):
    form_class = UserRegisterForm
    success_url = reverse_lazy("accounts:dashboard")
```

✔ Automatically logs in user after registration

---

### Login & Logout

* Uses Django’s `LoginView` and `LogoutView`
* Styled authentication form
* Prevents logged-in users from accessing login page

```python
class UserLoginView(LoginView):
    authentication_form = StyledAuthenticationForm
    redirect_authenticated_user = True
```

---

### Dashboard Redirection Logic

```python
class DashboardRedirectView(LoginRequiredMixin, View):
    def get(self, request):
        if request.user.role == User.ROLE_DOCTOR:
            return redirect("accounts:doctor-dashboard")
        return redirect("accounts:patient-dashboard")
```

✔ Ensures users always land on the correct dashboard

---

## 📊 Dashboards

### Base Dashboard Layout

File: `templates/accounts/dashboards/base_dashboard.html`

* Shared sidebar layout
* Responsive Tailwind-based structure

---

### Doctor Dashboard

File: `doctor_dashboard.html`

#### Features

* Today’s confirmed appointments
* Pending appointment requests
* Service, publication & achievement counts

#### Optimized Queries

```python
Appointment.objects.select_related("service", "availability")
```

✔ Prevents N+1 query issues

---

### Patient Dashboard

File: `patient_dashboard.html`

#### Features

* Appointment history
* Status badges (confirmed / pending / cancelled)
* Sorted by most recent

---

## 🔑 Password Management

### Password Change

* Requires authentication
* Uses Django’s built-in `PasswordChangeView`

Files:

* `password_change.html`
* `password_change_done.html`

---

## 🌐 URLs

### File: `urls.py`

```python
urlpatterns = [
    path("register/", RegisterView.as_view()),
    path("login/", UserLoginView.as_view()),
    path("logout/", UserLogoutView.as_view()),
    path("dashboard/", DashboardRedirectView.as_view()),
]
```

✔ Clean and RESTful routing

---

## 🎨 Frontend Stack

* **Tailwind CSS** for styling
* Fully responsive layouts
* Mobile-first authentication pages

---

## 🔐 Security Considerations

Implemented:

* CSRF protection
* Login-required mixins
* Role-based access control

Recommended Enhancements:

* `django-axes` (rate limiting)
* Email verification
* Password strength meter
* Two-factor authentication (optional)

---

## 🚀 Extensibility

This app is designed to easily support:

* Additional roles (Admin, Nurse)
* OAuth / Social login
* API authentication (JWT)
* Profile completeness tracking

---

## 🧪 Testing Suggestions

Recommended test coverage:

* Registration & login flows
* Role-based dashboard access
* Permission denial for wrong roles
* Password change flow

---

## ✅ Production Readiness Checklist

* [x] Custom user model
* [x] Role-based dashboards
* [x] Optimized database queries
* [x] Secure authentication
* [ ] Email verification
* [ ] Rate limiting
* [ ] Audit logging

---

## 📄 License

This module is intended for private or commercial use within a Django-based healthcare or SaaS application.

---

## ✨ Author Notes

This accounts system follows Django best practices and is suitable for scaling into a full medical platform. With minimal additions (email verification, audit logs), it can be deployed to production environments.

---

**Next recommended step:** Integrate `django-allauth` or add email verification + password reset UX.

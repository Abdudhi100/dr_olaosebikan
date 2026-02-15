# Profiles App (Django)

The `profiles` app is responsible for **public-facing and internal professional profiles**, primarily for doctors. It provides structured, SEO-friendly doctor profile pages that can be viewed by patients and visitors.

This app is designed to integrate tightly with the `accounts` app and supports scalable healthcare or SaaS platforms.

---

## 📌 Purpose

The `profiles` app handles:

* Doctor profile data storage
* Public doctor profile pages
* SEO-friendly profile URLs (slug-based)
* One-to-one relationship with authenticated users

It intentionally separates **authentication (accounts)** from **identity & presentation (profiles)**.

---

## 🏗️ App Structure

```
profiles/
├── admin.py
├── apps.py
├── models.py
├── views.py
├── urls.py
├── tests.py
├── migrations/
└── templates/
    └── profiles/
        └── doctor_profile.html
```

---

## 👤 Data Model

### File: `models.py`

#### DoctorProfile Model

```python
class DoctorProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    slug = models.SlugField(unique=True, blank=True)
    title = models.CharField(max_length=255)
    full_name = models.CharField(max_length=255)
    specialization = models.CharField(max_length=255)
```

### Key Characteristics

* **One-to-One relationship** with `AUTH_USER_MODEL`
* Profile data is separated from authentication logic
* Each doctor has exactly one profile

---

## 🔗 Slug & SEO Strategy

### Automatic Slug Generation

```python
def save(self, *args, **kwargs):
    if not self.slug:
        base = slugify(self.full_name)
        self.slug = f"{base}-{self.user_id}"
```

✔ Ensures uniqueness
✔ Human-readable URLs
✔ SEO-friendly structure

Example URL:

```
/profiles/john-doe-14/
```

---

## 🧠 Design Decisions

### Why use a separate Profile model?

* Avoids bloating the User model
* Supports future profile types (clinics, nurses)
* Allows public visibility without exposing auth data

---

## 🌐 Views

### File: `views.py`

#### DoctorProfileDetailView

```python
class DoctorProfileDetailView(DetailView):
    model = DoctorProfile
    template_name = 'profiles/doctor_profile.html'
```

### Responsibilities

* Fetch doctor profile by slug
* Render public profile page
* Provide clean context naming (`doctor`)

---

## 🧭 URLs

### File: `urls.py`

```python
urlpatterns = [
    path('<slug:slug>/', DoctorProfileDetailView.as_view(), name='doctor-profile'),
]
```

✔ Clean, RESTful, SEO-friendly routing

---

## 🎨 Templates

### File: `templates/profiles/doctor_profile.html`

#### UI Features

* Tailwind CSS-based layout
* Public-facing profile page
* Optimized typography for readability

#### Displayed Information

* Full name
* Specialization
* Years of experience
* Biography / rich content

---

## 🔐 Security Considerations

Implemented:

* No authentication data exposed
* Slug-based lookup prevents ID enumeration

Recommended Enhancements:

* Restrict profile creation to doctors only
* Prevent patients from creating profiles
* Add profile visibility toggles

---

## 🚀 Extensibility

This app is designed to scale with minimal changes:

* Add `PatientProfile` model
* Add profile editing views
* Add profile verification badges
* Add clinic affiliation
* Add ratings and reviews

---

## 🔄 Integration Points

Works closely with:

* `accounts` app (user roles)
* `appointments` app (booking from profile)
* `publications` app (doctor credibility)

---

## 🧪 Testing Recommendations

Suggested tests:

* Profile slug uniqueness
* Profile visibility
* 404 handling for invalid slugs
* One-to-one integrity with User

---

## ✅ Production Checklist

* [x] SEO-friendly URLs
* [x] Clean data separation
* [x] Public profile rendering
* [ ] Profile edit permissions
* [ ] Profile completeness scoring
* [ ] Caching (low-churn pages)

---

## 📄 License

This module is intended for private or commercial use within a Django-based healthcare platform.

---

## ✨ Author Notes

The `profiles` app is intentionally minimal but well-structured. It follows Django best practices and provides a strong foundation for public identity and trust-building features in medical platforms.

**Recommended next step:** Add profile editing, verification, and appointment booking CTA integration.

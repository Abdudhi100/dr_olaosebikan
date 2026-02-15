# Publications App (Django)

The **Publications** app manages academic outputs and professional achievements for doctors within the platform. It provides structured storage, public listing, and detail views for **research publications** and **career achievements**, supporting both academic visibility and professional credibility.

This app is designed to integrate tightly with the custom user system (`accounts` app) and is optimized for **read-heavy access**, SEO-friendly URLs, and future academic extensions (DOI, indexing, citations).

---

## 📌 Responsibilities

The `publications` app is responsible for:

* Managing doctor-authored **publications** (journals, abstracts, PDFs)
* Managing **professional achievements** (awards, recognitions)
* Public listing and detail views
* SEO-friendly publication URLs using slugs
* Admin-friendly content management

---

## 🏗️ App Structure

```
publications/
├── admin.py
├── apps.py
├── models.py
├── urls.py
├── views.py
├── templates/
│   └── publications/
│       ├── publication_list.html
│       ├── publication_detail.html
│       └── achievements.html
```

---

## 👤 Domain Model

### Relationship Overview

* A **Doctor (User)** can have:

  * Many `Publication`
  * Many `Achievement`

```text
User (Doctor)
 ├── publications (Publication)
 └── achievements (Achievement)
```

---

## 🏅 Achievement Model

### File: `models.py`

```python
class Achievement(models.Model):
    doctor = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    year = models.PositiveIntegerField()
    organization = models.CharField(max_length=255, blank=True)
```

### Key Design Decisions

* **Chronological ordering** by year (descending)
* Optional description for flexibility
* Organization field for institutions or awarding bodies

```python
class Meta:
    ordering = ['-year']
```

### Use Cases

* Awards
* Fellowships
* Certifications
* Conference recognitions

---

## 📄 Publication Model

### File: `models.py`

```python
class Publication(models.Model):
    doctor = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    journal = models.CharField(max_length=255)
    year = models.PositiveIntegerField()
    doi_link = models.URLField(blank=True)
    abstract = models.TextField(blank=True)
    pdf = models.FileField(upload_to="publications/pdfs/", blank=True, null=True)
    slug = models.SlugField(unique=True, blank=True)
```

### Key Features

* **DOI support** for academic referencing
* Optional **PDF upload** for full-text access
* Abstract support for indexing
* Slug-based URLs for SEO and readability

### Automatic Slug Generation

```python
def save(self, *args, **kwargs):
    if not self.slug:
        self.slug = slugify(f"{self.title}-{self.year}")
    super().save(*args, **kwargs)
```

✔ Ensures unique, human-readable URLs

---

## 👁️ Views

### File: `views.py`

The app uses **Django Class-Based Views** for clarity and extensibility.

---

### Achievement List View

```python
class AchievementListView(ListView):
    model = Achievement
    template_name = 'publications/achievements.html'
```

* Public-facing
* Ordered by most recent achievements

---

### Publication List View

```python
class PublicationListView(ListView):
    model = Publication
    paginate_by = 10
```

Features:

* Pagination for performance
* Optimized for long publication histories

---

### Publication Detail View

```python
class PublicationDetailView(DetailView):
    model = Publication
```

Features:

* Slug-based lookup
* SEO-friendly detail pages
* Suitable for indexing by search engines

---

## 🌐 URL Configuration

### File: `urls.py`

```python
urlpatterns = [
    path('achievements/', AchievementListView.as_view(), name='achievements'),
    path('', PublicationListView.as_view(), name='publication_list'),
    path('<slug:slug>/', PublicationDetailView.as_view(), name='publication_detail'),
]
```

### URL Design Philosophy

* Clean, predictable routes
* Slug-based publication detail URLs
* Separation of achievements and publications

---

## 🛠️ Admin Configuration

### File: `admin.py`

Both models are registered with optimized admin views.

#### Achievement Admin

```python
list_display = ('title', 'organization', 'year')
list_filter = ('year',)
search_fields = ('title', 'organization')
```

#### Publication Admin

```python
list_display = ('title', 'journal', 'year')
list_filter = ('year', 'journal')
search_fields = ('title', 'journal')
prepopulated_fields = {'slug': ('title',)}
```

✔ Enables efficient content management for large datasets

---

## 🎨 Templates & UI Responsibilities

The `publications` templates are responsible for:

* Displaying publication lists
* Rendering abstracts and metadata
* Showing achievement timelines
* Linking to PDFs and DOI pages

They are designed to integrate seamlessly with the project’s Tailwind-based design system.

---

## 🔐 Permissions & Access Control

### Current State

* All views are **publicly readable**
* Content creation and editing restricted to **admin interface**

### Recommended Enhancements

* Restrict creation to `Doctor` users
* Add per-doctor publication filtering
* Add draft / published states

---

## ⚡ Performance Considerations

Implemented:

* Database-level ordering
* Pagination on publication lists

Recommended:

* `select_related('doctor')` in views
* Caching publication lists
* CDN for PDF media files

---

## 🚀 Extensibility Roadmap

This app is designed to easily support:

* Citation counts
* BibTeX / RIS export
* Google Scholar integration
* Publication visibility toggles
* Multi-author publications
* API endpoints for research indexing

---

## 🧪 Testing Suggestions

Recommended test cases:

* Publication slug uniqueness
* Pagination behavior
* Achievement ordering
* Admin search and filters

---

## ✅ Production Readiness Checklist

* [x] Clean domain models
* [x] Slug-based URLs
* [x] Admin optimization
* [x] Pagination
* [ ] Permissions hardening
* [ ] Media storage (S3 / Cloudinary)
* [ ] Caching layer

---

## 📄 License

Intended for private or commercial use within a Django-based medical or academic platform.

---

## ✨ Author Notes

The `publications` app is intentionally simple, extensible, and academic-friendly. With minor additions (permissions, indexing, caching), it can scale to institutional-level research platforms or public-facing doctor profile systems.

---

**Recommended next step:** Add doctor-specific filtering and integrate publications into public doctor profile pages.

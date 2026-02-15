from core_app.seo import build_meta

class SEOMixin:
    seo_title = None
    seo_description = None
    seo_image = None
    seo_type = "website"
    seo_schema_type = None
    seo_keywords = None
    seo_robots = None

    def get_meta(self):
        return build_meta(
            title=self.seo_title,
            description=self.seo_description,
            image=self.seo_image,
            type=self.seo_type,
            schema_type=self.seo_schema_type,
            keywords=self.seo_keywords,
            robots=self.seo_robots,
        )

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        # Merge: DB defaults (already in context) + view overrides
        base_meta = context.get("meta", {})
        override = {k: v for k, v in self.get_meta().items() if v}

        context["meta"] = {**base_meta, **override}
        return context

from core_app.seo import build_meta


class SEOMixin:
    seo_title = None
    seo_description = None
    seo_image = None
    seo_type = "website"
    seo_schema_type = None
    seo_keywords = None
    seo_robots = None

    def get_seo_title(self):
        return self.seo_title

    def get_seo_description(self):
        return self.seo_description

    def get_seo_image(self):
        return self.seo_image

    def get_seo_type(self):
        return self.seo_type

    def get_seo_schema_type(self):
        return self.seo_schema_type

    def get_seo_keywords(self):
        return self.seo_keywords

    def get_seo_robots(self):
        return self.seo_robots

    def get_meta(self):
        return build_meta(
            title=self.get_seo_title(),
            description=self.get_seo_description(),
            image=self.get_seo_image(),
            type=self.get_seo_type(),
            schema_type=self.get_seo_schema_type(),
            keywords=self.get_seo_keywords(),
            robots=self.get_seo_robots(),
        )

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        base_meta = context.get("meta", {})
        override = {
            k: v for k, v in self.get_meta().items()
            if v not in (None, "", [], {})
        }
        context["meta"] = {**base_meta, **override}
        return context
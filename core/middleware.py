from urllib.parse import urlsplit, urlunsplit
from django.conf import settings
from django.http import HttpResponsePermanentRedirect


class CanonicalHostMiddleware:
    """
    Force all public GET/HEAD requests to the canonical SITE_URL host + scheme.
    Example:
      http://drolaosebikan.com/foo -> https://www.drolaosebikan.com/foo
      https://drolaosebikan.com/foo -> https://www.drolaosebikan.com/foo
    """
    def __init__(self, get_response):
        self.get_response = get_response
        self.canonical = urlsplit(settings.SITE_URL)

    def __call__(self, request):
        if request.method in ("GET", "HEAD"):
            current_scheme = "https" if request.is_secure() else "http"
            current_host = request.get_host()

            if (
                current_scheme != self.canonical.scheme
                or current_host != self.canonical.netloc
            ):
                target = urlunsplit((
                    self.canonical.scheme,
                    self.canonical.netloc,
                    request.path,
                    request.META.get("QUERY_STRING", ""),
                    "",
                ))
                return HttpResponsePermanentRedirect(target)

        return self.get_response(request)
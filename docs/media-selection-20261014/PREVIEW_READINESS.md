# Protected preview readiness

## Fresh evidence

ACCESS_READ_ONLY.json records project/deployment GET attempts on 14 October 2026: HTTP 401. Existing Wrangler 4.135.0 `whoami` under Node 22.16.0 exited 1: saved authentication expired and refresh failed in the noninteractive environment. No token was printed. No deployment, account policy, production setting, DNS or origin was changed. Current unauthenticated page/media protection has NOT been verified by this task.

Historical target (must reverify): account 93ea26958f716fb50ef1022a81846d9b, Pages project dr-olaosebikan-git, production branch main. Historical Access results do not establish protection of this candidate. The existing release gate remains unchanged.

## Ordered next steps

1. Restore saved account login interactively with the existing Wrangler CLI, then run read-only account/project/deployment checks. Verify project, actual production branch, custom domains and preview-only policy scope. Keep secrets out of logs.
2. Inspect Access applications and allow policies. Require only approved reviewers; verify no bypass/Everyone rule or unprotected hostname alias. Record the app/policy identity without credentials.
3. Before uploading any review footage, use an existing nonproduction deployment to test cookie-free GET/HEAD to `/`, `/appointments/book`, a real static image, a real video path and a Range request. Test hash URL, branch alias and every alternative media origin. Record statuses and sanitized redirect destinations. A 404 or noindex header does not prove Access protection.
4. Require a Cloudflare Access login redirect or explicit denial with no protected page/media bytes for unauthenticated requests. Verify authenticated reviewers receive the same assets successfully. If direct R2/CDN URLs return bytes without Access, the boundary fails; keep footage local until that origin is protected. Do not expose private source masters.
5. Only after this boundary and media permissions are verified, prepare an isolated candidate build bound to the exact commit and a nonproduction branch. Do not flip the release gate just to make a build pass. Keep mock booking. Verify preview `X-Robots-Tag: noindex`; noindex supplements Access and is not access control.
6. Repeat authenticated rendering at 390/768/1440/1920, original media and navigation checks, reduced-motion/Save-Data/pause/failure behavior, and performance measurements. Confirm ordinary navigation sends no booking request. Do not submit a live form under this media-selection task.
7. Recheck production branch/deployment ID/domains against the read-only before snapshot. Preserve draft PRs and production release approvals. Do not merge or deploy production.

[Cloudflare preview deployment guidance](https://developers.cloudflare.com/pages/configuration/preview-deployments/) explains preview visibility and Access protection. Test actual hash and alias URLs rather than assuming policy coverage. New stock assets remain unapproved and are not uploaded by this task.

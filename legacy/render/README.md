# Legacy Render Deployment Files

This directory archives files from the former Django/Render deployment path:

- `requirements.txt`
- `runtime.txt`
- `build.sh`

They are retained for historical and reference purposes only. They are not part
of the current production architecture, which is a static Next.js export hosted
on Cloudflare Pages with Web3Forms handling appointment submissions.

The branch `archive/pre-static-cleanup-2026-08-20` preserves the exact
pre-cleanup repository state. Restoring the old Django/Render deployment would
require a deliberate recovery process, including validating Python dependencies,
environment variables, database services, static file handling, and deployment
commands before any production use.

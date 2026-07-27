# Project Status

## Summary

The approved production target is a static Next.js export for Cloudflare Pages. Legacy Django code remains in the repository for reference only.

## Current Launch Status

- Static Next.js build: passing.
- Type-check: passing.
- Lint script: not defined in `package.json`.
- Test script: not defined in `package.json`.
- Appointment form: Web3Forms-ready, with WhatsApp fallback and missing-key handling.
- Publications: pending verified content.
- Achievements: pending verified content.
- Blog: not part of the approved public launch.

## Route Inventory

| Route | Page purpose | Build status | Content status | Main CTA | Blocker |
|---|---|---:|---|---|---|
| `/` | Homepage | Builds | Ready, pending final clinic approval | Book appointment | None known |
| `/about-dr-olaosebikan` | Doctor profile | Builds | Needs verified qualifications/affiliations | Book appointment | Content verification |
| `/appointments/book` | Appointment request | Builds | Ready, needs production Web3Forms env var | Submit request / WhatsApp | `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` |
| `/rheumatoid-arthritis-treatment-lagos` | Care-area page | Builds | Ready, pending clinical review | Book appointment | Clinical review |
| `/gout-treatment-lagos` | Care-area page | Builds | Ready, pending clinical review | Book appointment | Clinical review |
| `/lupus-care-lagos` | Care-area page | Builds | Ready, pending clinical review | Book appointment | Clinical review |
| `/joint-pain-and-stiffness-clinic-lagos` | Care-area page | Builds | Ready, pending clinical review | Book appointment | Clinical review |
| `/autoimmune-disease-specialist-lagos` | Care-area page | Builds | Ready, pending clinical review | Book appointment | Clinical review |
| `/contact` | Contact channels | Builds | Needs final contact confirmation | Book appointment | Contact verification |
| `/contact-location` | Location and visit guidance | Builds | Needs final location/hours confirmation | Book appointment | Contact verification |
| `/faq` | FAQ | Builds | Ready, pending clinical review | Book appointment | Clinical review |
| `/publications` | Publications listing | Builds | Empty, neutral message only | None | Verified publications needed |
| `/publications/achievements` | Achievements listing | Builds | Empty, neutral message only | Back home / appointment | Verified achievements needed |
| `/robots.txt` | Search engine policy | Builds | Ready | None | None known |
| `/sitemap.xml` | Search engine sitemap | Builds | Excludes empty publication/achievement sections | None | None known |

## Legacy Code Status

Django apps, templates, migrations, and Render-oriented files remain in the repository but are not part of the approved production architecture.

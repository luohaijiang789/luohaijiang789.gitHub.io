# Learning Lab maintenance

- This is a root-hosted Next.js App Router + React + TypeScript + MDX site, statically exported to GitHub Pages. Do not restore the Jekyll build.
- Product purpose: build computer fundamentals and AI/security skills through reproducible experiments, evidence and technical notes.
- Write Chinese-first technical content. Keep visual learning, accessibility and mobile reading central.
- Keep teaching examples separate from claims about the owner's actual experience. No invented achievements, statistics, progress or proficiency scores.
- Use primary sources for technical claims. Distinguish scope and limitations. Country-specific processes need official sources, applicability and verification dates.
- Keep learner data browser-local unless explicitly asked to change that. Preserve versioned backups and report storage failures.
- This is a single note directory: real articles live in `src/content/docs/notes/`. Homepage and sidebar derive from that collection. Do not reintroduce a dashboard, course paths, check-ins or review cards without a request.
- Keep `src/lib/progress.mjs` and its historical review IDs compatible with v1 backups; they no longer drive the reading interface. About provides browser-local backup import/export.
- Content lives in `src/content/docs/`. `archive/legacy-jekyll/` is preserved source, not active content.
- Only compile trusted, repository-owned MDX at build time. Never execute visitor-provided MDX. Use accessible Radix dialogs and responsive reading layouts.
- Run `npm run verify` after changes; run `npm run test:e2e` for interactive or navigation changes, after building. Never weaken checks merely to make them pass.
- Keep the repository's GitHub Pages deployment. Do not introduce another hosting account or publish to a different service without a request.
- At each completed, verified milestone, create a focused Git commit and push it to the tracked remote branch automatically. This is the owner's standing instruction; do not ask again for routine milestone commits or pushes. Fetch first, integrate remote changes without force-pushing, and check the resulting GitHub Pages workflow and deployed site.

- The English module was removed at the owner’s request. Do not restore it or search for replacement learning resources without a new request. Keep legacy v1 browser drafts exportable without publishing the removed content.
- When importing the owner’s shared discussions, use their actual text and images. Keep corrections and provenance; never present replacement visuals as original attachments.

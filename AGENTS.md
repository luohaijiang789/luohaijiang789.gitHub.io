# Learning Lab maintenance

- This is a root-hosted Astro + Starlight static GitHub Pages site. Do not restore the Jekyll build.
- Product purpose: strengthen AI/security skills, usable English, communication and overseas career readiness through linked learning paths and real outputs.
- Write Chinese-first content with purposeful English examples. Keep visual learning, accessibility and mobile reading central.
- Keep teaching examples separate from claims about the owner's actual experience. No invented achievements, statistics, progress or proficiency scores.
- Use primary sources for technical claims. Distinguish scope and limitations. Country-specific processes need official sources, applicability and verification dates.
- Keep learner data browser-local unless explicitly asked to change that. Preserve versioned backups and report storage failures.
- New learning state IDs belong in both `src/data/garden.ts` and the allowlists in `src/lib/progress.mjs`; do not break existing IDs.
- Content lives in `src/content/docs/`. `archive/legacy-jekyll/` is preserved source, not active content.
- Run `npm run verify` after changes; run `npm run test:e2e` for interactive or navigation changes, after building. Never weaken checks merely to make them pass.
- Keep the repository's GitHub Pages deployment. Do not introduce another hosting account or publish to a different service without a request.
- At each completed, verified milestone, create a focused Git commit and push it to the tracked remote branch automatically. This is the owner's standing instruction; do not ask again for routine milestone commits or pushes. Fetch first, integrate remote changes without force-pushing, and check the resulting GitHub Pages workflow and deployed site.

# RDM Workspace

Internal workflow centre for Reverb Daily Media, built with React, TypeScript, Cloudflare Pages Functions and Cloudflare D1.

## Local development

1. Run npm install.
2. Run npm run dev.

The interface uses preview data when the API/database is not connected.

## Cloudflare setup

1. Create a D1 database named rdm-workspace.
2. Run schema.sql against the database.
3. Add the database ID to wrangler.toml.
4. Add a Cloudflare Pages D1 binding named DB.
5. Build with npm run build and use dist as the output directory.

## Foundation

- Responsive workspace shell and navigation
- Overview dashboard and task summary
- Create tasks and change task status
- D1-backed task API
- Schema foundations for projects, team members and announcements

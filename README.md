# @modsentry/sdk

Official JavaScript SDK for ModSentry moderation endpoints.

## Install

```bash
npm install @modsentry/sdk
```

## Usage

```ts
import { ModsentryClient } from '@modsentry/sdk';

const client = new ModsentryClient({
  apiKey: process.env.MODSENTRY_API_KEY,
});

const result = await client.moderateMessage({
  sessionId: 'gaming_room_1',
  userId: 'user123',
  message: 'hello everyone',
});

console.log(result.decision);
```

## Default API URL

If `baseUrl` is omitted, the SDK uses:

`https://modsentry.appleberry.my`

You can still override it:

```ts
const client = new ModsentryClient({
  apiKey: process.env.MODSENTRY_API_KEY,
  baseUrl: 'https://staging.modsentry.appleberry.my',
});
```

## Monorepo SDK Generation

This package is generated from the filtered OpenAPI spec in `modsentry-api/openapi/swagger.npm.json`.

From the repo root:

```bash
npm --prefix modsentry-api run openapi:npm
```

## Release Automation

The package uses semantic versioning and `semantic-release`.

- Local dry-run:
  - `npm --prefix modsentry-npm run release:dry-run`
- CI publish:
  - GitHub Actions workflow: `.github/workflows/publish-modsentry-sdk.yml`
  - Required repository secret: `NPM_TOKEN`

Release versions are determined from Conventional Commits on `main`:

- `feat:` -> minor
- `fix:` -> patch
- `BREAKING CHANGE:` -> major

## Exposed API

- `moderateMessage`
- `moderateBatch`
- `getSessionSettings`
- `updateSessionSettings`

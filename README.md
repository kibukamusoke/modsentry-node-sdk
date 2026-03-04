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
  baseUrl: 'https://api.modsentry.com',
});

const result = await client.moderateMessage({
  sessionId: 'gaming_room_1',
  userId: 'user123',
  message: 'hello everyone',
});

console.log(result.decision);
```

## Monorepo SDK Generation

This package is generated from the filtered OpenAPI spec in `modsentry-api/openapi/swagger.npm.json`.

From the repo root:

```bash
npm --prefix modsentry-api run openapi:npm
```

## Exposed API

- `moderateMessage`
- `moderateBatch`
- `getSessionSettings`
- `updateSessionSettings`

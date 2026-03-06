# @modsentry/sdk

Official JavaScript SDK for ModSentry moderation APIs.

## Install

```bash
npm install @modsentry/sdk
```

## Quick start

```ts
import { ModsentryClient } from '@modsentry/sdk';

const client = new ModsentryClient({
  apiKey: process.env.MODSENTRY_API_KEY!,
});

const result = await client.moderateMessage({
  sessionId: 'gaming_room_1',
  userId: 'user123',
  message: 'hello everyone',
});

console.log(result.decision);
```

## Setup options (client config)

`new ModsentryClient(options)` supports the following options:

| Option | Type | Required | Default | Notes |
| --- | --- | --- | --- | --- |
| `apiKey` | `string` | Yes | - | Required ModSentry API key. Sent as `x-api-key` header. |
| `baseUrl` | `string` | No | `https://modsentry.appleberry.my` | If protocol is omitted (for example `modsentry.appleberry.my`), SDK prepends `https://`. |
| `withCredentials` | `boolean` | No | `false` | Pass-through to Axios `withCredentials`. |
| `headers` | `Record<string, string>` | No | `{}` | Extra default headers for all requests. |
| `timeoutMs` | `number` | No | `30000` | Request timeout in milliseconds. |

Example with all options:

```ts
import { ModsentryClient } from '@modsentry/sdk';

const client = new ModsentryClient({
  apiKey: process.env.MODSENTRY_API_KEY!,
  baseUrl: 'https://staging.modsentry.appleberry.my',
  withCredentials: false,
  headers: {
    'x-request-source': 'my-web-app',
  },
  timeoutMs: 45000,
});
```

Rotate key at runtime:

```ts
client.setApiKey(process.env.MODSENTRY_API_KEY_ROTATED!);
```

## API methods and payload options

### `moderateMessage(payload)`

```ts
const res = await client.moderateMessage({
  sessionId: 'webinar_2026_march',  // required
  userId: 'user_123',               // required
  message: 'message text',          // required
  messageId: 'msg_001',             // optional
  metadata: { room: 'main' },       // optional
  clientTs: new Date().toISOString()// optional
});
```

Payload fields:

- `sessionId: string` (required)
- `userId: string` (required)
- `message: string` (required)
- `messageId?: string`
- `metadata?: Record<string, unknown>`
- `clientTs?: string` (ISO timestamp recommended)

### `moderateBatch(payload)`

```ts
const batch = await client.moderateBatch({
  messages: [
    { sessionId: 's1', userId: 'u1', message: 'hello' },
    { sessionId: 's1', userId: 'u2', message: 'buy now!!!' }
  ]
});
```

Payload fields:

- `messages: ModerateMessageDto[]` (required)

### `getSessionSettings(sessionId)`

```ts
const settings = await client.getSessionSettings('gaming_room_1');
```

Arguments:

- `sessionId: string` (required)

### `updateSessionSettings(sessionId, payload)`

```ts
const updated = await client.updateSessionSettings('gaming_room_1', {
  mode: 'SLOW'
});
```

Arguments:

- `sessionId: string` (required)
- `payload.mode: 'OPEN' | 'SLOW' | 'APPROVAL_ONLY' | 'OFF'` (required)

## Response types

`moderateMessage` and each item in `moderateBatch.results` return:

- `decision: 'ALLOW' | 'BLOCK' | 'MUTE' | 'SHADOW_MUTE' | 'REVIEW'`
- `reasons: string[]`
- `sanitizedText: string`
- `actions`:
  - `strikeDelta: number`
  - `strikeCount: number`
  - `mutedUntil: string | null`
  - `shadowMutedUntil: string | null`
  - `banUntil: string | null`
  - `cooldownMs: number`
- `eventId: string`

## Moderation decision meanings

- `ALLOW`: message passed moderation checks and is allowed.
- `BLOCK`: hard deny for a message. Also used when a user is currently banned.
- `REVIEW`: message is flagged for manual review flow.
- `MUTE`: user is currently muted (temporary user-level restriction).
- `SHADOW_MUTE`: user is currently shadow-muted (user can continue posting, but messages are intended to be hidden from others).

Important behavior notes:

- `BLOCK` is primarily a message-level outcome.
- `MUTE` and `SHADOW_MUTE` are user-state restrictions that apply over time.
- There is a moderator `ban` action in dashboard APIs, but moderation events still store/show the decision as `BLOCK` (with reasons such as `USER_BANNED` or `ESCALATED_BAN`).

### How users become `MUTE` or `SHADOW_MUTE`

There are two paths:

1. Automatic escalation from strikes

- The moderation pipeline adds strikes for rule hits such as `HTML_DETECTED`, `RATE_LIMIT`, profanity/blocked-term hits, harassment heuristic hits, and OpenAI moderation flagged hits.
- When strike count crosses threshold, the system applies timed restrictions:
  - `LOW` sensitivity: mute at `5`, shadow-mute at `8`, ban at `12`
  - `MED` sensitivity: mute at `3`, shadow-mute at `5`, ban at `8`
  - `HIGH` sensitivity: mute at `2`, shadow-mute at `3`, ban at `5`
- Default restriction durations (configurable in backend `strikePolicy`):
  - `muteMinutes: 10`
  - `shadowMuteMinutes: 20`
  - `banMinutes: 60`
- While active, incoming messages from that user resolve to `MUTE` or `SHADOW_MUTE`.

2. Manual moderator action (dashboard API)

- Dashboard actions can apply `mute` or `shadow-mute` directly.
- If `durationMinutes` is omitted, backend defaults are:
  - `mute`: 10 minutes
  - `shadow-mute`: 20 minutes
- Current Portal Monitor UI sends explicit values:
  - `mute`: 15 minutes
  - `shadow-mute`: 20 minutes
- Manual `unmute` clears mute/shadow/ban state and can reset strike count.

Note: dashboard moderator actions are not currently exposed as methods in this NPM SDK client.

## Error handling

SDK throws `ModsentryApiError` for API failures:

```ts
import { ModsentryApiError } from '@modsentry/sdk';

try {
  await client.moderateMessage({
    sessionId: 's1',
    userId: 'u1',
    message: 'hello'
  });
} catch (error) {
  if (error instanceof ModsentryApiError) {
    console.error(error.status, error.code, error.message, error.details);
  } else {
    console.error(error);
  }
}
```

`ModsentryApiError` fields:

- `status: number`
- `code?: string`
- `message: string`
- `details?: unknown`

## Environment variable example

```bash
export MODSENTRY_API_KEY="mod_live_8fd92b..."
```

```ts
const client = new ModsentryClient({
  apiKey: process.env.MODSENTRY_API_KEY!,
});
```

## Monorepo SDK generation

This package is generated from the filtered OpenAPI spec at `modsentry-api/openapi/swagger.npm.json`.

From repository root:

```bash
npm --prefix modsentry-api run openapi:npm
```

## Release automation

`semantic-release` is configured for automated versioning and publish.

- Dry-run: `npm --prefix modsentry-npm run release:dry-run`
- Release: `npm --prefix modsentry-npm run release`
- CI workflow: `.github/workflows/publish-modsentry-sdk.yml`
- Required repository secret: `NPM_TOKEN`

Versioning rules (Conventional Commits):

- `feat:` -> minor
- `fix:` -> patch
- `BREAKING CHANGE:` -> major

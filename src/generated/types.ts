/*
 * AUTO-GENERATED FILE - DO NOT EDIT
 * Source: modsentry-api/openapi/swagger.npm.json
 * Generated at: 2026-03-04T14:51:13.767Z
 */

export type ModerationDecision = 'ALLOW' | 'BLOCK' | 'MUTE' | 'SHADOW_MUTE' | 'REVIEW';

export interface ModerateMessageDto {
  sessionId: string;
  userId: string;
  message: string;
  messageId?: string;
  metadata?: Record<string, unknown>;
  clientTs?: string;
}

export interface ModerateBatchDto {
  messages: ModerateMessageDto[];
}

export type SessionMode = 'OPEN' | 'SLOW' | 'APPROVAL_ONLY' | 'OFF';

export interface UpdateSessionSettingsDto {
  mode: SessionMode;
}

export interface ModerationActions {
  strikeDelta: number;
  strikeCount: number;
  mutedUntil: string | null;
  shadowMutedUntil: string | null;
  banUntil: string | null;
  cooldownMs: number;
}

export interface ModerationResult {
  decision: ModerationDecision;
  reasons: string[];
  sanitizedText: string;
  actions: ModerationActions;
  eventId: string;
}

export interface ModerateBatchResult {
  count: number;
  results: ModerationResult[];
}

export interface SessionSettings {
  projectId: string;
  sessionId: string;
  mode: SessionMode;
  createdAt: string | null;
  updatedAt: string | null;
}

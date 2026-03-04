import {
  GeneratedModsentryApiClient,
  type GeneratedClientOptions,
  type ModerateBatchDto,
  type ModerateBatchResult,
  type ModerateMessageDto,
  type ModerationResult,
  type SessionSettings,
  type UpdateSessionSettingsDto,
} from './generated';

export interface ModsentryClientOptions {
  apiKey: string;
  baseUrl?: string;
  withCredentials?: boolean;
  headers?: Record<string, string>;
  timeoutMs?: number;
}

function normalizeBaseUrl(baseUrl?: string) {
  if (!baseUrl) {
    return 'http://localhost:4000';
  }

  return baseUrl.replace(/\/$/, '');
}

export class ModsentryClient {
  private readonly generated: GeneratedModsentryApiClient;

  constructor(options: ModsentryClientOptions) {
    if (!options.apiKey || !options.apiKey.trim()) {
      throw new Error('ModsentryClient requires a non-empty apiKey');
    }

    const generatedOptions: GeneratedClientOptions = {
      apiKey: options.apiKey.trim(),
      baseUrl: normalizeBaseUrl(options.baseUrl),
      withCredentials: options.withCredentials,
      headers: options.headers,
      timeoutMs: options.timeoutMs,
    };

    this.generated = new GeneratedModsentryApiClient(generatedOptions);
  }

  setApiKey(apiKey: string) {
    if (!apiKey || !apiKey.trim()) {
      throw new Error('apiKey must be a non-empty string');
    }

    this.generated.setApiKey(apiKey);
  }

  async moderateMessage(payload: ModerateMessageDto): Promise<ModerationResult> {
    return this.generated.moderateMessage(payload);
  }

  async moderateBatch(payload: ModerateBatchDto): Promise<ModerateBatchResult> {
    return this.generated.moderateBatch(payload);
  }

  async getSessionSettings(sessionId: string): Promise<SessionSettings> {
    return this.generated.getSessionSettings(sessionId);
  }

  async updateSessionSettings(sessionId: string, payload: UpdateSessionSettingsDto): Promise<SessionSettings> {
    return this.generated.updateSessionSettings(sessionId, payload);
  }
}

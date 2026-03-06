/*
 * AUTO-GENERATED FILE - DO NOT EDIT
 * Source: modsentry-api/openapi/swagger.npm.json
 * Generated at: 2026-03-06T07:39:04.719Z
 */

import axios, { AxiosError, type AxiosInstance } from 'axios';
import type {
  ModerateBatchDto,
  ModerateBatchResult,
  ModerateMessageDto,
  ModerationResult,
  SessionSettings,
  UpdateSessionSettingsDto,
} from './types';

export interface GeneratedClientOptions {
  apiKey: string;
  baseUrl: string;
  withCredentials?: boolean;
  headers?: Record<string, string>;
  timeoutMs?: number;
}

export interface GeneratedApiErrorPayload {
  status: number;
  code?: string;
  message: string;
  details?: unknown;
}

export class GeneratedApiError extends Error implements GeneratedApiErrorPayload {
  status: number;
  code?: string;
  details?: unknown;

  constructor(payload: GeneratedApiErrorPayload) {
    super(payload.message);
    this.name = 'GeneratedApiError';
    this.status = payload.status;
    this.code = payload.code;
    this.details = payload.details;
  }
}

export class GeneratedModsentryApiClient {
  private apiKey: string;
  private readonly client: AxiosInstance;
  private readonly baseHeaders: Record<string, string>;

  constructor(options: GeneratedClientOptions) {
    this.apiKey = options.apiKey;
    this.baseHeaders = {
      ...(options.headers || {}),
      'x-modsentry-sdk-version': '1.0',
    };

    this.client = axios.create({
      baseURL: options.baseUrl,
      withCredentials: options.withCredentials || false,
      timeout: options.timeoutMs || 30_000,
      headers: this.baseHeaders,
    });
  }

  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
  }

  private requestHeaders() {
    return {
      ...this.baseHeaders,
      'x-api-key': this.apiKey,
    };
  }

  private toApiError(error: unknown) {
    const axiosError = error as AxiosError<any>;
    return new GeneratedApiError({
      status: axiosError.response?.status || 500,
      code: axiosError.response?.data?.code,
      message: axiosError.response?.data?.message || axiosError.message || 'ModSentry API request failed',
      details: axiosError.response?.data,
    });
  }

  async moderateMessage(payload: ModerateMessageDto): Promise<ModerationResult> {
    try {
      const response = await this.client.post<ModerationResult>('/v1/moderate/message', payload, {
        headers: this.requestHeaders(),
      });
      return response.data;
    } catch (error) {
      throw this.toApiError(error);
    }
  }

  async moderateBatch(payload: ModerateBatchDto): Promise<ModerateBatchResult> {
    try {
      const response = await this.client.post<ModerateBatchResult>('/v1/moderate/batch', payload, {
        headers: this.requestHeaders(),
      });
      return response.data;
    } catch (error) {
      throw this.toApiError(error);
    }
  }

  async getSessionSettings(sessionId: string): Promise<SessionSettings> {
    try {
      const response = await this.client.get<SessionSettings>(`/v1/session/${encodeURIComponent(sessionId)}/settings`, {
        headers: this.requestHeaders(),
      });
      return response.data;
    } catch (error) {
      throw this.toApiError(error);
    }
  }

  async updateSessionSettings(sessionId: string, payload: UpdateSessionSettingsDto): Promise<SessionSettings> {
    try {
      const response = await this.client.post<SessionSettings>(`/v1/session/${encodeURIComponent(sessionId)}/settings`, payload, {
        headers: this.requestHeaders(),
      });
      return response.data;
    } catch (error) {
      throw this.toApiError(error);
    }
  }
}

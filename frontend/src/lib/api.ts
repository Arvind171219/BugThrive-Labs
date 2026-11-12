/*
 * Minimal API client for the BugThrive Labs backend.
 * Every backend response uses the envelope { success, message, data, errors, path, timestamp }.
 */

const BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, "") ?? "";

export interface FieldError {
  field: string;
  message: string;
}

interface ApiEnvelope<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: FieldError[];
}

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly fieldErrors: FieldError[] = [],
  ) {
    super(message);
    this.name = "ApiError";
  }

  /** Field errors keyed by field name (first message wins). */
  get fieldErrorMap(): Record<string, string> {
    return this.fieldErrors.reduce<Record<string, string>>((acc, e) => {
      acc[e.field] ??= e.message;
      return acc;
    }, {});
  }
}

let unauthorizedHandler: (() => void) | null = null;

/** Called when an authenticated request gets a 401 (expired or revoked token). */
export function setUnauthorizedHandler(handler: (() => void) | null) {
  unauthorizedHandler = handler;
}

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  token?: string | null;
  signal?: AbortSignal;
}

export async function apiRequest<T>(path: string, { method = "GET", body, token, signal }: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;

  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") throw err;
    throw new ApiError("Can't reach the BugThrive Labs server. Check that the backend is running.", 0);
  }

  let envelope: ApiEnvelope<T> | null = null;
  try {
    envelope = (await response.json()) as ApiEnvelope<T>;
  } catch {
    // Non-JSON response (e.g. proxy error page).
  }

  if (!response.ok || !envelope?.success) {
    if (response.status === 401 && token) unauthorizedHandler?.();
    const message =
      envelope?.message ?? (response.status >= 500 ? "Something went wrong on our side. Please try again." : `Request failed (${response.status})`);
    throw new ApiError(message, response.status, envelope?.errors ?? []);
  }

  return envelope.data as T;
}

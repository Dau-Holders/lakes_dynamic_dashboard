import type { FieldValues, Path, UseFormSetError } from "react-hook-form";

/**
 * Standardized API Error Response Interface
 * Matches the backend's standardized error format (apps/users/exceptions.py):
 * { success: false, error, message, errors: { field: [msg, ...] }, status_code }
 */
export interface APIError {
  success: false;
  error: string;
  message: string;
  errors: Record<string, unknown>;
  status_code: number;
}

export interface ParsedAPIError {
  /** Human-readable summary, safe to show in a toast/Messages. */
  message: string;
  /** Field name -> list of messages (nested serializer errors are flattened). */
  fieldErrors: Record<string, string[]>;
  /** HTTP status, or undefined for network errors. */
  status?: number;
}

const NETWORK_MESSAGE =
  "Unable to reach the server. Please check your connection and try again.";
const FALLBACK_MESSAGE = "An unexpected error occurred. Please try again.";

// Keys that are metadata, not form fields (standard envelope + simplejwt extras).
const NON_FIELD_KEYS = new Set([
  "success",
  "error",
  "message",
  "errors",
  "status_code",
  "detail",
  "code",
  "messages",
  "non_field_errors",
]);

function toMessages(value: unknown): string[] {
  if (value == null) return [];
  if (Array.isArray(value)) return value.flatMap(toMessages);
  if (typeof value === "object") return Object.values(value).flatMap(toMessages);
  return [String(value)];
}

function collectFieldErrors(source: Record<string, unknown>): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const [field, value] of Object.entries(source)) {
    if (NON_FIELD_KEYS.has(field)) continue;
    // Flatten nested serializer errors: { authors: { 0: { name: [...] } } } -> authors
    const msgs = toMessages(value);
    if (msgs.length) out[field] = msgs;
  }
  return out;
}

/**
 * Parse any axios error into a message + field errors.
 * Supports the standardized backend format and, as a fallback, the
 * default DRF format ({ field: [...] } / { detail: "..." }).
 */
export function parseAPIError(error: any): ParsedAPIError {
  const response = error?.response;
  if (!response) {
    return { message: NETWORK_MESSAGE, fieldErrors: {} };
  }

  const status: number | undefined = response.status;
  const data = response.data;

  if (data && typeof data === "object" && !Array.isArray(data)) {
    const isStandard = "success" in data && "errors" in data;
    const fieldErrors = collectFieldErrors(
      isStandard && data.errors && typeof data.errors === "object" ? data.errors : data
    );
    const nonField = toMessages(data.non_field_errors);
    const message =
      (isStandard && typeof data.message === "string" && data.message) ||
      (typeof data.detail === "string" && data.detail) ||
      nonField[0] ||
      (Object.keys(fieldErrors).length
        ? "Validation failed. Please check the provided data."
        : FALLBACK_MESSAGE);
    return { message, fieldErrors, status };
  }

  if (Array.isArray(data) && data.length) {
    return { message: toMessages(data).join(" "), fieldErrors: {}, status };
  }

  // Non-JSON body (e.g. a proxy's HTML 502 page)
  if (status && status >= 500) {
    return {
      message: "The server is having trouble right now. Please try again shortly.",
      fieldErrors: {},
      status,
    };
  }
  return { message: FALLBACK_MESSAGE, fieldErrors: {}, status };
}

function humanize(field: string): string {
  const s = field.replace(/_/g, " ");
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/**
 * Format API error responses for display in PrimeReact Messages/Toast.
 * Field errors are listed one per line ("Password: This password is too common.").
 */
export function formatAPIError(error: any): string {
  const { message, fieldErrors } = parseAPIError(error);
  const lines = Object.entries(fieldErrors).map(
    ([field, msgs]) => `${humanize(field)}: ${msgs.join(" ")}`
  );
  return lines.length ? lines.join("\n") : message;
}

/**
 * Show backend field errors under the matching react-hook-form inputs.
 *
 * @param fields - the form's field names; errors for other keys are returned
 *                 so the caller can show them in a toast.
 * @returns parsed error plus `unmatched` lines that couldn't be attached to a field.
 */
export function applyAPIFieldErrors<T extends FieldValues>(
  error: any,
  setError: UseFormSetError<T>,
  fields: readonly Path<T>[]
): ParsedAPIError & { unmatched: string[] } {
  const parsed = parseAPIError(error);
  const known = new Set<string>(fields);
  const unmatched: string[] = [];

  for (const [field, msgs] of Object.entries(parsed.fieldErrors)) {
    if (known.has(field)) {
      setError(field as Path<T>, { type: "server", message: msgs.join(" ") });
    } else {
      unmatched.push(`${humanize(field)}: ${msgs.join(" ")}`);
    }
  }
  return { ...parsed, unmatched };
}

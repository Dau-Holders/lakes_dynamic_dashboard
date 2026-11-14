import { test } from "node:test";
import assert from "node:assert/strict";
import { applyAPIFieldErrors, bannerMessage, formatAPIError, isBadLinkError, parseAPIError } from "./errorHandling.ts";

const apiError = (status: number, data: unknown) => ({ response: { status, data } });
const envelope = (errors: Record<string, unknown>, message = "Validation failed. Please check the provided data.") => ({
  success: false,
  error: "validation_error",
  message,
  errors,
  status_code: 400,
});

test("nested serializer errors are reported under the inner field name", () => {
  const { fieldErrors } = parseAPIError(
    apiError(400, envelope({ user: { email: ["This email is already in use."] } }))
  );
  assert.deepEqual(fieldErrors, { email: ["This email is already in use."] });
});

function recordSetError() {
  const calls: Record<string, string> = {};
  const setError = (field: string, error: { message?: string }) => {
    calls[field] = error.message ?? "";
  };
  return { calls, setError };
}

test("backend field names can be mapped onto differently named form fields", () => {
  const { calls, setError } = recordSetError();
  const { unmatched } = applyAPIFieldErrors(
    apiError(400, envelope({ author: ["This field may not be blank."], title: ["Too long."] })),
    setError,
    ["authors", "title"],
    { author: "authors" }
  );
  assert.deepEqual(calls, { authors: "This field may not be blank.", title: "Too long." });
  assert.deepEqual(unmatched, []);
});

test("banner points at the form when every field error is shown inline", () => {
  const { setError } = recordSetError();
  const applied = applyAPIFieldErrors(
    apiError(400, envelope({ password: ["This password is too common."] })),
    setError,
    ["password"]
  );
  assert.equal(bannerMessage(applied, "Please fix the highlighted fields."), "Please fix the highlighted fields.");
});

test("banner lists field errors that have no matching input", () => {
  const { setError } = recordSetError();
  const applied = applyAPIFieldErrors(
    apiError(400, envelope({ password: ["Too common."], uploader: ["Invalid user."] })),
    setError,
    ["password"]
  );
  assert.equal(bannerMessage(applied, "Please fix the highlighted fields."), "Uploader: Invalid user.");
});

test("banner shows the backend message when there are no field errors", () => {
  const { setError } = recordSetError();
  const applied = applyAPIFieldErrors(
    apiError(401, {
      success: false,
      error: "authentication_failed",
      message: "No active account found with the given credentials",
      errors: {},
      status_code: 401,
    }),
    setError,
    ["email", "password"]
  );
  assert.equal(
    bannerMessage(applied, "Please fix the highlighted fields."),
    "No active account found with the given credentials"
  );
});

test("an invalid uid or token means the emailed link is bad", () => {
  assert.equal(isBadLinkError(parseAPIError(apiError(400, envelope({ token: ["Invalid token for given user."] })))), true);
  assert.equal(isBadLinkError(parseAPIError(apiError(400, envelope({ uid: ["Invalid user id or user doesn't exist."] })))), true);
  assert.equal(isBadLinkError(parseAPIError(apiError(400, envelope({ new_password: ["This password is too common."] })))), false);
});

test("the exact signup response from the backend lists the password error", () => {
  assert.equal(
    formatAPIError(apiError(400, envelope({ password: ["This password is too common."] }))),
    "Password: This password is too common."
  );
});

test("legacy DRF responses (errors at the top level) are still understood", () => {
  assert.equal(
    formatAPIError(apiError(400, { email: ["user with this email already exists."] })),
    "Email: user with this email already exists."
  );
});

test("simplejwt's code/messages extras are not treated as form fields", () => {
  const parsed = parseAPIError(
    apiError(401, { success: false, message: "Token is invalid", errors: { code: ["token_not_valid"], messages: [{}] } })
  );
  assert.deepEqual(parsed.fieldErrors, {});
  assert.equal(parsed.message, "Token is invalid");
});

test("network failures and non-JSON server errors get readable messages", () => {
  assert.equal(formatAPIError({ message: "Network Error" }), "Unable to reach the server. Please check your connection and try again.");
  assert.equal(formatAPIError(apiError(502, "<html>Bad Gateway</html>")), "The server is having trouble right now. Please try again shortly.");
});

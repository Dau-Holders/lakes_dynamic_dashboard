import type { RefObject } from "react";

/** Anything with PrimeReact's Messages/Toast imperative API. */
interface MessageTarget {
  clear(): void;
  show(message: MessageOptions | MessageOptions[]): void;
}

interface MessageOptions {
  severity: "success" | "info" | "warn" | "error";
  detail: string;
  summary?: string;
  sticky?: boolean;
  closable?: boolean;
  life?: number;
}

/**
 * Replace whatever the Messages/Toast is showing with a single message.
 * Clearing first means a success never appears next to a stale error (and vice versa).
 * Defaults: sticky and closable, so errors stay until the user dismisses them.
 */
export function showMessage(
  target: RefObject<MessageTarget | null>,
  severity: MessageOptions["severity"],
  detail: string,
  options: Partial<Omit<MessageOptions, "severity" | "detail">> = {}
): void {
  target.current?.clear();
  target.current?.show([
    {
      severity,
      detail,
      sticky: options.life === undefined,
      closable: true,
      ...options,
    },
  ]);
}

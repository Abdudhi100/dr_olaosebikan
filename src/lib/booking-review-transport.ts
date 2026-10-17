import type { BookingPayload } from "./booking";

export type ReviewScenario = "acknowledged" | "definite-failure" | "uncertain";
export type ReviewOutcome = { kind: ReviewScenario };
export type ReviewTransport = (
  payload: BookingPayload,
) => Promise<ReviewOutcome>;

const waitFor = (milliseconds: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, milliseconds));

/** Local simulation only. There is intentionally no provider, credential or network branch. */
export function createReviewTransport({
  scenario = "acknowledged",
  delayMs = 600,
  wait = waitFor,
}: {
  scenario?: ReviewScenario;
  delayMs?: number;
  wait?: (milliseconds: number) => Promise<void>;
} = {}): ReviewTransport {
  return async () => {
    await wait(delayMs);
    return { kind: scenario };
  };
}

/**
 * Only an explicit mock definite-failure result establishes rejection.
 * A thrown error or deadline is uncertain. Never retry automatically.
 * The caller owns attempt/reset identity so an old completion cannot alter UI.
 */
export async function submitWithTimeout(
  transport: ReviewTransport,
  payload: BookingPayload,
  timeoutMs = 8000,
): Promise<ReviewOutcome> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const deadline = new Promise<ReviewOutcome>((resolve) => {
    timer = setTimeout(() => resolve({ kind: "uncertain" }), timeoutMs);
  });
  const attempt = Promise.resolve()
    .then(() => transport(payload))
    .then((outcome): ReviewOutcome => {
      if (
        outcome?.kind === "acknowledged" ||
        outcome?.kind === "definite-failure"
      )
        return outcome;
      return { kind: "uncertain" };
    })
    .catch((): ReviewOutcome => ({ kind: "uncertain" }));
  try {
    return await Promise.race([attempt, deadline]);
  } finally {
    clearTimeout(timer);
  }
}

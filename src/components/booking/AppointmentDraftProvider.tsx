"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createEmptyBookingDraft, type BookingDraft } from "@/lib/booking";

type SubmissionLock = "submitting" | "uncertain" | null;

type AppointmentDraftContextValue = {
  draft: BookingDraft;
  updateDraft: (patch: Partial<BookingDraft>) => void;
  resetDraft: () => void;
  revision: number;
  submissionLock: SubmissionLock;
  setSubmissionLock: (value: SubmissionLock) => void;
  getSubmissionLock: () => SubmissionLock;
};

const AppointmentDraftContext =
  createContext<AppointmentDraftContextValue | null>(null);

// Each mounted client tree owns its draft. Nothing is written to a URL, storage or server singleton.
export function AppointmentDraftProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [draft, setDraft] = useState(createEmptyBookingDraft);
  const [revision, setRevision] = useState(0);
  const [submissionLock, setLockState] = useState<SubmissionLock>(null);
  const lockRef = useRef<SubmissionLock>(null);
  const setSubmissionLock = useCallback((value: SubmissionLock) => {
    lockRef.current = value;
    setLockState(value);
  }, []);
  const getSubmissionLock = useCallback(() => lockRef.current, []);
  const updateDraft = useCallback((patch: Partial<BookingDraft>) => {
    setDraft((current) => ({ ...current, ...patch }));
  }, []);
  const resetDraft = useCallback(() => {
    setDraft(createEmptyBookingDraft());
    setSubmissionLock(null);
    setRevision((current) => current + 1);
  }, [setSubmissionLock]);
  const value = useMemo(
    () => ({
      draft,
      updateDraft,
      resetDraft,
      revision,
      submissionLock,
      setSubmissionLock,
      getSubmissionLock,
    }),
    [
      draft,
      updateDraft,
      resetDraft,
      revision,
      submissionLock,
      setSubmissionLock,
      getSubmissionLock,
    ],
  );

  return (
    <AppointmentDraftContext.Provider value={value}>
      {children}
    </AppointmentDraftContext.Provider>
  );
}

export function useAppointmentDraft() {
  const context = useContext(AppointmentDraftContext);
  if (!context)
    throw new Error("Appointment controls require the client draft provider.");
  return context;
}

// MOCK: an in-memory session until Clerk lands. It resets on reload.
export type SessionUser = { name?: string; email: string };

let user: SessionUser | null = null;
const listeners = new Set<() => void>();

const emit = () => listeners.forEach((listener) => listener());

export const getSessionUser = () => user;

export const subscribeSession = (listener: () => void) => {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
};

export const setSessionUser = (next: SessionUser) => {
  user = next;
  emit();
};

export const clearSession = () => {
  user = null;
  emit();
};

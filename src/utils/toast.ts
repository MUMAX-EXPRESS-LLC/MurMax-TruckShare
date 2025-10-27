// Simple global toaster (no deps)
export type ToastKind = "success" | "error" | "info" | "warning";
type Detail = { id: string; kind: ToastKind; message: string; timeout?: number };

const channel = new EventTarget();

export function onToast(cb: (d: Detail) => void) {
  const handler = (e: Event) => cb((e as CustomEvent<Detail>).detail);
  channel.addEventListener("app:toast", handler as EventListener);
  return () => channel.removeEventListener("app:toast", handler as EventListener);
}

function push(kind: ToastKind, message: string, timeout = 3000) {
  const id = Math.random().toString(36).slice(2, 9);
  channel.dispatchEvent(new CustomEvent("app:toast", { detail: { id, kind, message, timeout } }));
  return id;
}

export const toast = {
  success: (m: string, t?: number) => push("success", m, t),
  error: (m: string, t?: number) => push("error", m, t),
  info: (m: string, t?: number) => push("info", m, t),
  warning: (m: string, t?: number) => push("warning", m, t),
};

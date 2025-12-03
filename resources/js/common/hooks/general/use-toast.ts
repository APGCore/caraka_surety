import type { ToastActionElement, ToastProps } from "@/components/_shadcn-ui/toast";
import * as React from "react";

/** =========================
 *  Konfigurasi
 *  ========================= */
export const TOAST_LIMIT = 5; // ubah sesuai kebutuhan, atau pakai Number.POSITIVE_INFINITY
export const TOAST_REMOVE_DELAY = 200; // waktu setelah close sebelum benar2 dihapus (sinkron animasi out)

/** =========================
 *  Types & Constants
 *  ========================= */
type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
  /** Durasi otomatis menutup (ms). Jika tidak diisi, default 4000ms. Jika 0/negatif, tidak auto-close */
  duration?: number;
};

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const;

type ActionType = typeof actionTypes;

type Action =
  | { type: ActionType["ADD_TOAST"]; toast: ToasterToast }
  | { type: ActionType["UPDATE_TOAST"]; toast: Partial<ToasterToast> & { id: string } }
  | { type: ActionType["DISMISS_TOAST"]; toastId?: ToasterToast["id"] }
  | { type: ActionType["REMOVE_TOAST"]; toastId?: ToasterToast["id"] };

interface State {
  toasts: ToasterToast[];
}

/** =========================
 *  Internal State & Helpers
 *  ========================= */
let count = 0;
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

const listeners: Array<(state: State) => void> = [];
let memoryState: State = { toasts: [] };

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();
const toastAutoCloseTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => listener(memoryState));
}

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) return;

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({ type: "REMOVE_TOAST", toastId });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
};

const clearRemoveTimeout = (toastId: string) => {
  const t = toastTimeouts.get(toastId);
  if (t) {
    clearTimeout(t);
    toastTimeouts.delete(toastId);
  }
};

const scheduleAutoClose = (toastId: string, duration?: number) => {
  const ms = typeof duration === "number" ? duration : 4000;
  if (ms <= 0) return;

  // bersihkan kalau ada yang lama
  const prev = toastAutoCloseTimeouts.get(toastId);
  if (prev) clearTimeout(prev);

  const t = setTimeout(() => {
    dispatch({ type: "DISMISS_TOAST", toastId });
  }, ms);

  toastAutoCloseTimeouts.set(toastId, t);
};

const clearAutoClose = (toastId: string) => {
  const t = toastAutoCloseTimeouts.get(toastId);
  if (t) {
    clearTimeout(t);
    toastAutoCloseTimeouts.delete(toastId);
  }
};

/** =========================
 *  Reducer
 *  ========================= */
export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST": {
      const next = [action.toast, ...state.toasts];
      return {
        ...state,
        toasts: TOAST_LIMIT === Number.POSITIVE_INFINITY ? next : next.slice(0, TOAST_LIMIT),
      };
    }

    case "UPDATE_TOAST": {
      return {
        ...state,
        toasts: state.toasts.map((t) => (t.id === action.toast.id ? { ...t, ...action.toast } : t)),
      };
    }

    case "DISMISS_TOAST": {
      const { toastId } = action;

      // jadwalkan remove setelah animasi
      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        state.toasts.forEach((t) => addToRemoveQueue(t.id));
      }

      return {
        ...state,
        toasts: state.toasts.map((t) => (t.id === toastId || toastId === undefined ? { ...t, open: false } : t)),
      };
    }

    case "REMOVE_TOAST": {
      if (action.toastId === undefined) {
        // bersihkan semua timeout
        state.toasts.forEach((t) => {
          clearRemoveTimeout(t.id);
          clearAutoClose(t.id);
        });
        return { ...state, toasts: [] };
      }

      // bersihkan timeout untuk toast spesifik
      clearRemoveTimeout(action.toastId);
      clearAutoClose(action.toastId);

      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
    }
  }
};

/** =========================
 *  Public API
 *  ========================= */
type Toast = Omit<ToasterToast, "id" | "open" | "onOpenChange">;

function _toast({ ...props }: Toast) {
  const id = genId();

  const update = (patch: Partial<ToasterToast>) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...patch, id },
    });

  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });

  // Tambah toast
  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
      },
    },
  });

  // Jadwalkan auto-close per-toast
  scheduleAutoClose(id, props.duration);

  return { id, dismiss, update };
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState);

  // penting: daftar listener sekali saja
  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) listeners.splice(index, 1);
    };
  }, []); // ⬅️ kosong

  return {
    ...state,
    toast: _toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  };
}

export { useToast, _toast as toast };

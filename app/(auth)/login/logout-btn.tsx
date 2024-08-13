"use client";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

export function LogoutButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="flex items-center gap-1 rounded px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 hover:text-black"
    >
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Cerrar sesión
    </button>
  );
}

"use client";

import { useState, type FormEvent } from "react";

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!ok) {
      setStatus("error");
      return;
    }
    // Local mock — no backend yet (Dokploy later).
    setStatus("ok");
    setEmail("");
  }

  return (
    <div className="flex max-w-[480px] min-w-0 flex-1 flex-col gap-2.5 basis-[360px]">
      <label htmlFor="mv-mail" className="text-[15px] font-bold">
        Pas encore sur les stores ? Être prévenu du lancement.
      </label>
      <form
        onSubmit={onSubmit}
        className="flex overflow-hidden rounded-lg border-2 border-forest bg-ground"
      >
        <input
          id="mv-mail"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="adresse@email.fr"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status !== "idle") setStatus("idle");
          }}
          className="h-[54px] min-w-0 flex-1 border-0 bg-transparent px-4 text-base font-semibold text-forest outline-none placeholder:text-[#4A5A50]"
        />
        <button
          type="submit"
          className="cursor-pointer border-0 bg-forest px-5 text-[15px] font-extrabold text-ground"
        >
          Être prévenu
        </button>
      </form>
      {status === "ok" && (
        <p className="text-sm font-semibold" role="status">
          Merci — on vous prévient au lancement.
        </p>
      )}
      {status === "error" && (
        <p className="text-sm font-semibold text-[#5a2018]" role="alert">
          Indiquez une adresse e-mail valide.
        </p>
      )}
    </div>
  );
}

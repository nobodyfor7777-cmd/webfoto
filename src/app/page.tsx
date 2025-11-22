"use client";

import { FormEvent, useState } from "react";

interface UploadResult {
  id: string;
  url: string;
  imageUrl: string;
  size: number;
  originalSize: number;
}

function formatBytes(value: number) {
  return `${(value / 1024).toFixed(1)} KB`;
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setResult(null);
    setCopied(false);

    if (!file) {
      setError("Pilih gambar terlebih dahulu.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error ?? "Gagal mengunggah gambar.");
      }

      setResult(payload as UploadResult);
      setFile(null);
      (event.currentTarget as HTMLFormElement).reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan tak terduga.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleCopy() {
    if (!result?.url) return;
    try {
      await navigator.clipboard.writeText(result.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setError("Gagal menyalin tautan ke clipboard.");
    }
  }

  return (
    <div className="flex min-h-screen justify-center bg-zinc-100 px-4 py-12 text-zinc-900">
      <main className="flex w-full max-w-3xl flex-col gap-8 rounded-2xl bg-white p-8 shadow-lg">
        <header className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight">
            Kompres &amp; Hosting Gambar Cepat
          </h1>
          <p className="text-sm text-zinc-600">
            Unggah gambar, biarkan Tinify mengompres otomatis, lalu dapatkan tautan halaman
            dengan metadata lengkap untuk pratinjau di platform mana pun.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6" autoComplete="off">
          <div className="flex flex-col gap-2">
            <label htmlFor="file" className="text-sm font-medium text-zinc-700">
              Pilih gambar (JPG, PNG, atau WEBP)
            </label>
            <input
              id="file"
              name="file"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(event) => {
                setError(null);
                setResult(null);
                const selected = event.target.files?.[0];
                setFile(selected ?? null);
              }}
              className="w-full rounded-lg border border-zinc-200 px-4 py-3 text-sm file:mr-4 file:cursor-pointer file:rounded-md file:border-0 file:bg-zinc-900 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:border-zinc-300"
            />
            <p className="text-xs text-zinc-500">
              Sistem otomatis mengompres menggunakan Tinify tanpa batasan ukuran khusus.
            </p>
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Memproses..." : "Kompres & Publikasikan"}
          </button>
        </form>

        {result && (
          <section className="space-y-4 rounded-xl border border-zinc-200 bg-zinc-50 p-6">
            <h2 className="text-lg font-semibold">Gambar Siap Dibagikan</h2>
            <div className="grid gap-2 text-sm text-zinc-600 sm:grid-cols-2">
              <div>
                <p className="font-medium text-zinc-700">Tautan halaman pratinjau</p>
                <p className="break-all text-zinc-900">{result.url}</p>
              </div>
              <div>
                <p className="font-medium text-zinc-700">Tautan gambar langsung</p>
                <p className="break-all text-zinc-900">{result.imageUrl}</p>
              </div>
              <div className="text-sm text-zinc-600">
                <p>Ukuran asli: {formatBytes(result.originalSize)}</p>
                <p>Setelah kompres: {formatBytes(result.size)}</p>
                <p className="mt-2 text-green-600">
                  Kompresi: {Math.round((1 - result.size / result.originalSize) * 100)}% lebih kecil
                </p>
                <p className="mt-2 text-blue-600">
                  <a href={result.url} target="_blank" rel="noopener noreferrer" className="underline">
                    Lihat halaman gambar
                  </a>
                </p>
                <p className="text-xs text-zinc-500 mt-4">
                  Salin dan bagikan tautan di atas ke WhatsApp atau media sosial lainnya untuk menampilkan pratinjau gambar.
                </p>
              </div>
            </div>

            <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={result.imageUrl} alt="Pratinjau hasil kompresi" className="h-auto w-full" />
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

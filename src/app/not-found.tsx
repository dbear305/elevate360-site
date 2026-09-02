import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#020817] px-6 text-white">
      <div className="w-full max-w-xl rounded-[32px] border border-white/10 bg-white/[0.05] p-8 text-center shadow-2xl shadow-black/30 sm:p-12">
        <Image
          src="/logo.png"
          alt="Elevate360 Systems logo"
          width={64}
          height={64}
          className="mx-auto h-16 w-16"
        />
        <p className="mt-8 text-sm font-semibold uppercase tracking-[0.24em] text-sky-300">
          404
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">
          This page doesn&apos;t exist.
        </h1>
        <p className="mt-4 text-base leading-8 text-slate-300">
          The address may have changed, or the link may be incorrect.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-slate-200"
        >
          Return home
        </Link>
      </div>
    </main>
  );
}

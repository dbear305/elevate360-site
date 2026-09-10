import Image from "next/image";
import Link from "next/link";

const phoneDisplay = "786-312-7320";

export function SystemHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#020817]/92 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:flex-nowrap sm:px-6">
        <Link href="/" className="flex min-w-0 items-center gap-3 sm:gap-4">
          <Image
            src="/logo.png"
            alt="Elevate360 Systems logo"
            width={56}
            height={56}
            priority
            className="h-11 w-11 shrink-0 sm:h-14 sm:w-14"
          />
          <div className="min-w-0 leading-tight">
            <div className="truncate text-sm font-semibold tracking-tight text-white sm:text-lg">
              Elevate360 Systems
            </div>
            <div className="hidden truncate text-sm text-slate-400 sm:block">
              Systems in action
            </div>
          </div>
        </Link>

        <nav
          aria-label="Systems navigation"
          className="flex w-full shrink-0 items-center justify-between gap-2 sm:w-auto sm:gap-3"
        >
          <Link
            href="/systems"
            className="rounded-full border border-white/15 bg-white/5 px-3 py-2.5 text-sm font-medium text-white hover:bg-white/10 sm:px-5"
          >
            Systems
          </Link>
          <Link
            href="/systems/nettruth"
            className="rounded-full border border-sky-300/30 bg-sky-300/10 px-3 py-2.5 text-sm font-semibold text-sky-200 hover:bg-sky-300/20 sm:px-5"
          >
            Network Test
          </Link>
          <a
            href="tel:+17863127320"
            className="rounded-full bg-white px-3 py-2.5 text-sm font-semibold text-slate-950 hover:bg-slate-200 sm:px-5"
          >
            <span className="sm:hidden">Call</span>
            <span className="hidden sm:inline">Call {phoneDisplay}</span>
          </a>
        </nav>
      </div>
    </header>
  );
}

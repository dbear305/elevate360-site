import Link from "next/link";

export function SystemFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#020817]">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Elevate360 Systems LLC</p>
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          <Link href="/" className="hover:text-white">
            Company
          </Link>
          <a
            href="mailto:contact@elevate360systems.com"
            className="hover:text-white"
          >
            contact@elevate360systems.com
          </a>
        </div>
      </div>
    </footer>
  );
}

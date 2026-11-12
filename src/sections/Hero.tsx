import { useRef } from "react";
import { ArrowDown, FileDown } from "lucide-react";
import VectorField from "@/components/VectorField";
import DecodeText from "@/components/DecodeText";
import { scrollToSection } from "@/lib/scroll";
import { usePalette } from "@/contexts/PaletteContext";
import { PROFILE, withBase } from "@/data/links";
import { useGlitchCycle } from "@/lib/hooks";
import avatar from "@/assets/new-avatar.jpg?w=160&format=webp&quality=80";

export default function Hero() {
  const hostRef = useRef<HTMLElement>(null);
  const status = useGlitchCycle(PROFILE.status);
  const { open } = usePalette();

  return (
    <section
      ref={hostRef}
      id="top"
      aria-label="Introduction"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden"
    >
      <VectorField hostRef={hostRef} />

      {/* Keeps the text readable where it overlaps the field. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgb(var(--scrim))_46%,transparent_58%)] min-[900px]:bg-[linear-gradient(to_right,rgb(var(--scrim))_30%,rgb(var(--scrim)/0.7)_44%,transparent_60%)]"
      />

      <div className="wrap relative mt-auto pb-10 pt-[calc(5rem+31svh)] min-[900px]:my-auto min-[900px]:pb-16 min-[900px]:pt-28">
        <p className="kicker flex items-center gap-3 motion-safe:animate-[rise_700ms_var(--ease-out)_200ms_both]">
          <span className="text-signal">~/aawaiz</span>
          <span>{PROFILE.location}</span>
        </p>

        <h1 className="mt-4 font-mono text-display font-bold">
          <span className="block">
            <DecodeText text={PROFILE.firstName} delay={150} duration={700} />
          </span>
          <span className="block text-accent-ink">
            <DecodeText text={PROFILE.lastName} delay={450} duration={700} />
          </span>
        </h1>

        <div className="motion-safe:animate-[rise_800ms_var(--ease-out)_900ms_both]">
          <p className="mt-6 max-w-[34rem] text-xl leading-snug text-ink sm:text-[1.75rem] sm:leading-tight">
            {PROFILE.role} <span className="text-muted">{PROFILE.headline}</span>
          </p>

          <div className="mt-6 flex items-center gap-3">
            <img
              src={avatar}
              alt=""
              width={40}
              height={40}
              className="size-10 rounded-full object-cover ring-1 ring-line-strong"
            />
            <p className="font-mono text-sm text-muted">
              currently hacking on <span className="text-signal">{status}</span>
              <span aria-hidden="true" className="ml-0.5 inline-block h-4 w-2 translate-y-0.5 bg-signal motion-safe:animate-blink" />
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#work"
              onClick={(e) => {
                if (scrollToSection("work")) e.preventDefault();
              }}
              className="group inline-flex h-12 items-center gap-2 rounded-lg bg-accent px-5 font-mono text-sm font-semibold text-on-accent transition-[transform,filter] duration-150 ease-out hover:brightness-105 active:scale-[0.97]"
            >
              See my work
              <ArrowDown className="size-4 transition-transform duration-200 ease-out group-hover:translate-y-0.5" />
            </a>
            <a
              href={withBase(PROFILE.resumeUrl)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-12 items-center gap-2 rounded-lg border border-line-strong bg-bg/40 px-5 font-mono text-sm text-ink backdrop-blur-sm transition-[border-color,transform] duration-150 ease-out hover:border-faint active:scale-[0.97]"
            >
              Résumé
              <FileDown className="size-4" />
            </a>
            <button
              type="button"
              onClick={open}
              className="hidden h-12 items-center px-2 font-mono text-sm text-faint transition-colors hover:text-muted md:inline-flex"
            >
              or press <kbd className="mx-1.5 rounded border border-line px-1.5 py-0.5 text-xs">/</kbd> to jump anywhere
            </button>
          </div>
        </div>
      </div>

      <p className="pointer-events-none absolute bottom-6 right-4 hidden max-w-[19rem] text-right font-mono text-xs leading-relaxed text-faint sm:right-8 min-[900px]:block lg:right-12">
        Every point is a project or skill, placed by similarity. Your cursor is a nearest-neighbour query. Click a yellow point to open it.
      </p>
    </section>
  );
}

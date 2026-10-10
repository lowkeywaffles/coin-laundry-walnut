"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Armchair, Basket, Coins, Cookie, Headset, MapPin, NavigationArrow, Phone, Van, WashingMachine, Wheelchair, WifiHigh, X } from "@phosphor-icons/react";
import { useLenis } from "lenis/react";
import { BorderBeam } from "@/components/ui/border-beam";
import { MagicCard } from "@/components/ui/magic-card";
import { Marquee } from "@/components/ui/marquee";
import { Reveal, Wrap, flipTheme, fmtH, type Hours } from "@/components/kit";
import { Faq, MapFrame, useDark, useStatus } from "@/components/blocks";
import { T, useLang, useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const TEL = "tel:+12142380306", PHONE = "(214) 238-0306";
const DIR = "https://www.google.com/maps/dir/?api=1&destination=9751+Walnut+St+Ste+130+Dallas+TX+75243";
const img = (p: string) => (process.env.NEXT_PUBLIC_BASE ?? "") + "/images/" + p;
// Weekdays 7 AM to 10 PM confirmed; weekend hours unconfirmed, shown as "call to confirm".
const HOURS: Hours = { 0: null, 1: [7, 22], 2: [7, 22], 3: [7, 22], 4: [7, 22], 5: [7, 22], 6: null };
const DYN = {
  en: { days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], confirm: "Call to confirm", callToday: "Call for today's hours", lang: "Language: English. Cambiar a español", theme: "Toggle dark mode" },
  es: { days: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"], confirm: "Llama para confirmar", callToday: "Llama para el horario de hoy", lang: "Idioma: español. Switch to English", theme: "Cambiar modo oscuro" },
};
const AMEN = [
  { k: "c1", Icon: WashingMachine, cls: "md:col-span-2 md:row-span-2", big: true }, { k: "c2", Icon: Headset }, { k: "c3", Icon: Coins },
  { k: "c4", Icon: Basket }, { k: "c5", Icon: Armchair }, { k: "c6", Icon: Cookie }, { k: "c7", Icon: WifiHigh },
  { k: "c8", Icon: Van }, { k: "c9", Icon: Wheelchair },
];
const SHOTS = [["storefront.webp", "altStore", "capStore"], ["lounge.webp", "altLounge", "capLounge"], ["machines.webp", "altMachines", "capMachines"]];

const btn = "inline-flex items-center justify-center gap-2.5 rounded-full px-6 py-3.5 text-[15px] font-bold transition-[transform,background-color] duration-300 ease-spring hover:-translate-y-0.5 active:scale-[.97]";
const primary = cn(btn, "bg-red text-white shadow-[inset_0_-2px_0_rgba(0,0,0,.2),0_14px_30px_-14px_var(--red)]");
const ghost = cn(btn, "bg-card text-ink shadow-[inset_0_0_0_1px_var(--line)]");

/** Language: a washer's cycle dial. Click to turn it from EN to ES. */
function Dial() {
  const { lang, setLang } = useLang();
  const es = lang === "es";
  return (
    <button type="button" onClick={() => setLang(es ? "en" : "es")} aria-label={DYN[es ? "es" : "en"].lang} className="relative flex h-11 flex-none cursor-pointer items-center gap-2 rounded-full bg-card ps-1 pe-3 shadow-[inset_0_0_0_1px_var(--line)]">
      <motion.span animate={{ rotate: es ? 120 : -30 }} transition={{ type: "spring", stiffness: 200, damping: 12 }}
        className="relative grid size-9 place-items-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#f4f6fb,#c7cddd)] shadow-[inset_0_0_0_2px_#9aa3bd,0_2px_4px_var(--shadow)]">
        <span className="absolute top-1 h-3 w-1 rounded-full bg-red" />
      </motion.span>
      <span className="grid text-[10px] leading-[1.15] font-extrabold tracking-wider">
        <span className={es ? "text-soft/50" : "text-redtext"}>EN</span><span className={es ? "text-redtext" : "text-soft/50"}>ES</span>
      </span>
    </button>
  );
}

/** Theme: a porthole door. Bubbles by day; at night it tumbles round to a moon. */
function Porthole() {
  const { dark, setTheme } = useDark();
  const { lang } = useLang();
  const [n, setN] = useState(0);
  return (
    <button type="button" aria-label={DYN[lang === "es" ? "es" : "en"].theme} aria-pressed={dark}
      onClick={e => { setN(x => x + 1); flipTheme(e.currentTarget, () => flushSync(() => setTheme(dark ? "light" : "dark"))); }}
      className="relative size-11 flex-none cursor-pointer rounded-full bg-[#dfe3ee] p-[3px] shadow-[inset_0_0_0_2px_#9aa3bd]">
      <span key={n} className={cn("relative block size-full overflow-hidden rounded-full shadow-[inset_0_0_0_2px_rgba(0,0,0,.15)] transition-[background] duration-500", n && "tumble", dark ? "bg-[radial-gradient(circle_at_40%_35%,#22305f,#0b1230)]" : "bg-[radial-gradient(circle_at_40%_35%,#9fd7ff,#3d7bd8)]")}>
        {dark ? <span className="absolute top-[7px] left-[9px] size-[15px] rounded-full bg-[#eef0fa] shadow-[-4px_-1px_0_0_#0b1230_inset]" />
          : [6, 14, 21].map((x, i) => <i key={x} className="sud absolute bottom-1 size-[5px] rounded-full bg-white/85" style={{ left: x, animationDelay: `${i * 0.6}s` }} />)}
      </span>
    </button>
  );
}

/** Hero photo inside a washer door; the drum turns a little as you scroll. */
function Door() {
  const ref = useRef<HTMLDivElement>(null);
  const t = useT();
  useGSAP(() => {
    gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(".drum", { rotate: -120, scale: 0.8, opacity: 0, duration: 1.6, ease: "expo.out", delay: 0.2 });
      gsap.to(".drum-img", { rotate: 40, scale: 1.18, ease: "none", scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: true } });
    });
  }, { scope: ref });
  return (
    <div ref={ref} className="relative aspect-square w-full max-w-[500px]">
      <div className="drum absolute inset-0 rounded-full bg-[linear-gradient(145deg,#f1f3f8,#b9c1d6)] p-[5%] shadow-[0_50px_100px_-40px_var(--shadow),inset_0_2px_0_#fff] dark:bg-[linear-gradient(145deg,#2a3354,#121833)]">
        <div className="size-full rounded-full bg-[#2c355a] p-[3%] shadow-[inset_0_6px_20px_rgba(0,0,0,.5)]">
          <div className="relative size-full overflow-hidden rounded-full">
            <img src={img("machines.webp")} alt={t("alt:altMachines")} fetchPriority="high" className="drum-img size-full scale-110 object-cover" />
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,.35),transparent_45%)]" />
          </div>
        </div>
      </div>
      <span className="absolute top-[46%] -right-3 h-16 w-5 rounded-full bg-[linear-gradient(90deg,#c7cddd,#8b93ab)] shadow-md rtl:right-auto rtl:-left-3" aria-hidden="true" />
      {([["floatAttendant", Headset, "-left-6 top-[10%] -rotate-3"], ["floatWifi", WifiHigh, "-right-4 bottom-[6%] rotate-2"]] as const).map(([k, I, pos]) => (
        <div key={k} className={cn("glass absolute flex w-max max-w-[240px] items-center gap-3 rounded-2xl py-3 ps-3 pe-5 shadow-[inset_0_0_0_1px_var(--line),0_24px_50px_-20px_var(--shadow)] max-sm:hidden", pos)}>
          <span className="grid size-10 flex-none place-items-center rounded-xl bg-blue text-white"><I size={20} weight="bold" /></span>
          <span className="text-[15px] font-bold [&_small]:block [&_small]:text-[13px] [&_small]:font-medium [&_small]:text-soft" dangerouslySetInnerHTML={{ __html: t(k) }} />
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const t = useT();
  const { lang } = useLang();
  const L = lang === "es" ? "es" : "en";
  const status = useStatus(HOURS);
  const lenis = useLenis();
  const [shot, setShot] = useState<number | null>(null);
  const steps = useRef<HTMLDivElement>(null);
  useEffect(() => { if (shot === null) lenis?.start(); else lenis?.stop(); }, [shot, lenis]);
  useEffect(() => { const k = (e: KeyboardEvent) => e.key === "Escape" && setShot(null); addEventListener("keydown", k); return () => removeEventListener("keydown", k); }, []);
  useGSAP(() => {
    gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(".track", { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { trigger: steps.current, start: "top 75%", end: "bottom 55%", scrub: true } });
    });
  }, { scope: steps });
  const statusText = status.today >= 0 && !HOURS[status.today] ? DYN[L].callToday : status.text;

  return (
    <>
      <header className="pointer-events-none sticky top-3 z-40 px-4">
        <nav className="glass pointer-events-auto mx-auto flex h-[72px] max-w-[1180px] items-center justify-between gap-3 rounded-full border border-line ps-6 pe-2.5 shadow-[inset_0_1px_0_var(--hi),0_20px_50px_-28px_var(--shadow)]">
          <a href="#top" className="flex flex-none flex-col items-start gap-0.5 leading-none" aria-label="Coin Laundry Lavandería @ Walnut">
            <span className="sign font-display text-[21px]">COIN LAUNDRY</span><span className="pill ms-2.5 !px-2 !py-[3px] !text-[9.5px]">Lavandería</span>
          </a>
          <div className="flex items-center gap-1 text-[15px] font-semibold max-[1060px]:hidden">
            {[["amenities", "navAmenities"], ["inside", "navInside"], ["visit", "navVisit"]].map(([id, k]) => <a key={id} href={`#${id}`} className="rounded-full px-4 py-2 text-soft transition-colors hover:bg-bg2 hover:text-ink" dangerouslySetInnerHTML={{ __html: t(k) }} />)}
          </div>
          <div className="flex items-center gap-2.5">
            <Dial /><Porthole />
            <a href={TEL} className={cn(primary, "px-5 py-2.5 max-sm:hidden")}><Phone size={17} weight="bold" />{PHONE}</a>
          </div>
        </nav>
      </header>

      <main id="top">
        <section className="relative overflow-hidden pt-16 pb-24 max-sm:pt-10">
          <div className="pointer-events-none absolute -top-40 -left-40 -z-10 size-[560px] rounded-full bg-[radial-gradient(closest-side,rgba(214,31,44,.1),transparent)]" />
          <div className="pointer-events-none absolute -right-40 -bottom-40 -z-10 size-[560px] rounded-full bg-[radial-gradient(closest-side,rgba(29,63,176,.12),transparent)]" />
          <Wrap className="grid grid-cols-[1.05fr_.95fr] items-center gap-14 max-[1000px]:grid-cols-1">
            <div>
              <Reveal>
                <span className="mb-6 inline-flex items-center gap-2 rounded-full bg-card px-3.5 py-1.5 text-sm font-semibold shadow-[inset_0_0_0_1px_var(--line)]">
                  <i className={cn("size-2 rounded-full", status.open ? "bg-[#1f9d55] shadow-[0_0_0_4px_rgba(31,157,85,.2)]" : "bg-[#c2410c]")} />{statusText || " "}
                </span>
              </Reveal>
              <Reveal delay={0.08}><T k="heroTitle" as="h1" className="mb-6 text-[clamp(54px,7.6vw,104px)]" /></Reveal>
              <Reveal delay={0.16}><T k="heroLead" as="p" className="mb-9 max-w-[48ch] text-lg text-soft" /></Reveal>
              <Reveal delay={0.24} className="mb-8 flex flex-wrap gap-3">
                <a href={DIR} target="_blank" rel="noopener" className={primary}><NavigationArrow size={18} weight="bold" /><T k="directions" /></a>
                <a href={TEL} className={ghost}><Phone size={18} weight="bold" /><T k="callUs" /></a>
              </Reveal>
              <Reveal delay={0.3} className="flex items-center gap-2.5 text-sm text-soft"><span className="tracking-[2px] text-[#f5a524]">★★★★☆</span><T k="rating" className="[&_strong]:text-base [&_strong]:text-ink" /></Reveal>
            </div>
            <Reveal delay={0.12} className="w-full max-w-[500px] justify-self-end max-[1000px]:justify-self-center"><Door /></Reveal>
          </Wrap>
        </section>

        <div className="bg-navy py-5 text-white" aria-hidden="true">
          <Marquee className="[--duration:26s] [--gap:3rem]">
            {["stripWifi", "stripParking", "stripChanger", "stripAccess"].map(k => <span key={k} className="flex items-center gap-12 font-display text-2xl"><T k={k} /><i className="size-3 rounded-full bg-red" /></span>)}
          </Marquee>
        </div>

        <section id="amenities" className="scroll-mt-24 py-32 max-sm:py-20">
          <Wrap>
            <Reveal className="mb-14 max-w-[740px]"><T k="amenEyebrow" className="pill mb-5" /><T k="amenTitle" as="h2" className="mb-4 text-[clamp(42px,5.6vw,72px)]" /><T k="amenLead" as="p" className="max-w-[58ch] text-[17px] text-soft" /></Reveal>
            <div className="grid auto-rows-[minmax(190px,auto)] grid-cols-1 gap-4 md:grid-cols-4">
              {AMEN.map(({ k, Icon, cls, big }, i) => (
                <Reveal key={k} delay={(i % 4) * 0.05} className={cn("rounded-[24px] bg-card p-1.5 shadow-[inset_0_0_0_1px_var(--line)] transition-transform duration-500 ease-silk hover:-translate-y-1", cls)}>
                  <MagicCard gradientSize={220} gradientColor="rgba(29,63,176,.1)" gradientFrom="#d61f2c" gradientTo="#1d3fb0" className="h-full rounded-[19px] [&>div:last-child]:h-full">
                    <div className={cn("flex h-full flex-col justify-between gap-6 p-6", big && "bg-navy p-9 text-white")}>
                      <span className={cn("grid place-items-center rounded-2xl", big ? "size-16 bg-red" : "size-11 bg-tintblue text-bluetext")}><Icon size={big ? 34 : 22} weight="duotone" /></span>
                      <div><T k={`${k}t`} as="h3" className={cn("mb-2", big ? "text-[clamp(34px,3.6vw,48px)]" : "text-[21px]")} /><T k={`${k}p`} as="p" className={cn("text-[14.5px]", big ? "max-w-[40ch] text-[16px] text-white/75" : "text-soft")} /></div>
                    </div>
                  </MagicCard>
                </Reveal>
              ))}
            </div>
          </Wrap>
        </section>

        <section id="inside" className="scroll-mt-24 bg-bg2 py-32 max-sm:py-20">
          <Wrap>
            <Reveal className="mb-14 max-w-[740px]"><T k="insideEyebrow" className="pill mb-5" /><T k="insideTitle" as="h2" className="mb-4 text-[clamp(42px,5.6vw,72px)]" /><T k="insideLead" as="p" className="text-[17px] text-soft" /></Reveal>
            <div className="grid grid-cols-[1.3fr_1fr] grid-rows-2 gap-4 max-[860px]:grid-cols-1 max-[860px]:grid-rows-none">
              {SHOTS.map(([f, alt, cap], i) => (
                <Reveal key={f} delay={i * 0.07} className={cn(i === 0 && "row-span-2")}>
                  <button type="button" onClick={() => setShot(i)} className="group relative block size-full min-h-[240px] cursor-zoom-in overflow-hidden rounded-[24px] text-start shadow-[0_30px_60px_-40px_var(--shadow)]">
                    <img src={img(f)} alt={t(`alt:${alt}`)} loading="lazy" className="absolute inset-0 size-full object-cover transition-transform duration-[1.2s] ease-silk group-hover:scale-105" />
                    <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-6 pt-16 pb-5 font-semibold text-white" dangerouslySetInnerHTML={{ __html: t(cap) }} />
                  </button>
                </Reveal>
              ))}
            </div>
          </Wrap>
        </section>

        <section className="py-32 max-sm:py-20">
          <Wrap>
            <Reveal className="mb-16 max-w-[740px]"><T k="howEyebrow" className="pill mb-5" /><T k="howTitle" as="h2" className="text-[clamp(42px,5.6vw,72px)]" /></Reveal>
            <div ref={steps} className="relative grid grid-cols-4 gap-6 max-[900px]:grid-cols-2 max-sm:grid-cols-1">
              <div className="absolute inset-x-[6%] top-7 h-1 rounded-full bg-line max-[900px]:hidden"><div className="track h-full origin-left rounded-full bg-[linear-gradient(90deg,#d61f2c,#1d3fb0)] rtl:origin-right" /></div>
              {[1, 2, 3, 4].map(n => (
                <Reveal key={n} delay={n * 0.07} className="relative">
                  <span className="relative mb-6 grid size-14 place-items-center rounded-full bg-red font-display text-2xl text-white shadow-[0_0_0_8px_var(--bg)]">{n}</span>
                  <T k={`s${n}t`} as="h3" className="mb-2 text-[24px]" /><T k={`s${n}p`} as="p" className="text-[15px] text-soft" />
                </Reveal>
              ))}
            </div>
          </Wrap>
        </section>

        <section id="visit" className="scroll-mt-24 bg-bg2 py-32 max-sm:py-20">
          <Wrap>
            <Reveal className="mb-12 max-w-[740px]"><T k="visitEyebrow" className="pill mb-5" /><T k="navVisit" as="h2" className="mb-4 text-[clamp(42px,5.6vw,72px)]" /><T k="visitLead" as="p" className="text-[17px] text-soft" /></Reveal>
            <div className="grid grid-cols-[.9fr_1.1fr] gap-5 max-[960px]:grid-cols-1">
              <Reveal className="relative overflow-hidden rounded-[26px] bg-card p-8 shadow-[inset_0_0_0_1px_var(--line)]">
                <BorderBeam size={200} duration={11} colorFrom="#d61f2c" colorTo="#1d3fb0" borderWidth={1.5} />
                <T k="hoursTitle" as="h3" className="mb-5 text-[30px]" />
                <table className="mb-6 w-full text-[15px]"><tbody>
                  {[1, 2, 3, 4, 5, 6, 0].map(d => { const h = HOURS[d]; return (
                    <tr key={d} className={cn("border-b border-line", status.today === d && "font-bold text-redtext")}>
                      <td className="py-2.5">{DYN[L].days[d]}{status.today === d && " •"}</td>
                      <td className="py-2.5 text-end tabular-nums">{h ? `${fmtH(h[0])} - ${fmtH(h[1])}` : <span className="rounded-full bg-[#fff1d6] px-2.5 py-0.5 text-[13px] font-semibold text-[#8a5a00] dark:bg-[#3a2c10] dark:text-[#f5c86a]">{DYN[L].confirm}</span>}</td>
                    </tr>); })}
                </tbody></table>
                <div className="grid gap-4">
                  {([[DIR, MapPin, "9751 Walnut St, Ste 130", "Dallas, TX 75243"], [TEL, Phone, PHONE, ""]] as const).map(([href, I, a, b]) => (
                    <a key={a} href={href} target={b ? "_blank" : undefined} rel="noopener" className="group flex items-center gap-3.5">
                      <span className="grid size-11 flex-none place-items-center rounded-xl bg-tintblue text-bluetext transition-transform duration-300 ease-spring group-hover:scale-110"><I size={20} weight="bold" /></span>
                      <span><strong className="block">{a}</strong>{b && <span className="text-sm text-soft">{b}</span>}</span>
                    </a>
                  ))}
                </div>
              </Reveal>
              <Reveal delay={0.08} className="min-h-[440px] overflow-hidden rounded-[26px] shadow-[inset_0_0_0_1px_var(--line)]"><MapFrame q="9751+Walnut+St+Ste+130,+Dallas,+TX+75243" title="Map to Coin Laundry @ Walnut" className="min-h-[440px]" /></Reveal>
            </div>
          </Wrap>
        </section>

        <section className="py-32 max-sm:py-20">
          <Wrap className="grid grid-cols-[.8fr_1.2fr] gap-14 max-[960px]:grid-cols-1">
            <Reveal><T k="faqEyebrow" className="pill mb-5" /><T k="faqTitle" as="h2" className="text-[clamp(42px,5.6vw,72px)]" /></Reveal>
            <Faq ids={[1, 2, 3, 4, 5]} accent="text-redtext" />
          </Wrap>
        </section>

        <section className="pb-32 max-sm:pb-20">
          <Wrap>
            <Reveal className="relative flex items-center justify-between gap-8 overflow-hidden rounded-full bg-blue px-16 py-14 text-white shadow-[inset_0_-4px_0_rgba(0,0,0,.2)] max-[960px]:flex-col max-[960px]:items-start max-[960px]:rounded-[36px] max-sm:px-7">
              <div><T k="ctaTitle" as="h2" className="mb-2 text-[clamp(40px,5vw,68px)]" /><T k="ctaLead" as="p" className="max-w-[52ch] text-lg text-white/80" /></div>
              <a href={DIR} target="_blank" rel="noopener" className={cn(primary, "flex-none px-8 py-4 text-lg")}><T k="ctaBtn" /></a>
            </Reveal>
          </Wrap>
        </section>
      </main>

      <footer className="pb-28">
        <Wrap><div className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-7 text-sm text-soft">
          <span className="flex flex-col items-start gap-0.5 leading-none"><span className="sign font-display text-lg">COIN LAUNDRY</span><span className="pill ms-2 !px-2 !py-[3px] !text-[9px]">Lavandería</span></span>
          <span>© {new Date().getFullYear()} Coin Laundry @ Walnut · 9751 Walnut St, Ste 130, Dallas, TX 75243 · <a href={TEL}>{PHONE}</a></span>
        </div></Wrap>
      </footer>
      <div className="glass fixed inset-x-3 bottom-3 z-30 hidden gap-2 rounded-full p-1.5 shadow-[inset_0_0_0_1px_var(--line)] max-sm:flex">
        <a href={TEL} className={cn(primary, "flex-1 py-3")}><T k="callNow" /></a>
        <a href={DIR} target="_blank" rel="noopener" className={cn(ghost, "flex-1 py-3")}><T k="dirShort" /></a>
      </div>

      <AnimatePresence>
        {shot !== null && (
          <motion.div role="dialog" aria-modal="true" aria-label={t(`alt:${SHOTS[shot][1]}`)} onClick={() => setShot(null)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 grid place-items-center bg-[#05081a]/90 p-6 backdrop-blur-md">
            <motion.img src={img(SHOTS[shot][0])} alt={t(`alt:${SHOTS[shot][1]}`)} onClick={e => e.stopPropagation()} initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 220, damping: 24 }} className="max-h-[86vh] w-auto rounded-2xl" />
            <button type="button" aria-label="Close" onClick={() => setShot(null)} className="absolute top-5 right-5 grid size-12 cursor-pointer place-items-center rounded-full bg-red text-white"><X size={22} weight="bold" /></button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

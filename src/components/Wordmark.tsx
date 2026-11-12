import logoFile from "@/assets/Aawaiz.S-Logo.png?w=400&format=webp&quality=80";

/** The signature logo, painted in the current text colour via a CSS mask. */
export default function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span
      role="img"
      aria-label="Aawaiz Soomro"
      className={`inline-block aspect-[1680/733] bg-current ${className}`}
      style={{
        maskImage: `url(${logoFile})`,
        WebkitMaskImage: `url(${logoFile})`,
        maskSize: "contain",
        WebkitMaskSize: "contain",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
      }}
    />
  );
}

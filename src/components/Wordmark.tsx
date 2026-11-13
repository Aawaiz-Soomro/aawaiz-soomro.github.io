import small from "@/assets/Aawaiz.S-Logo.png?w=400&format=webp&quality=80";
import big from "@/assets/Aawaiz.S-Logo.png?w=1600&format=webp";

/** The signature logo, painted in the current text colour via a CSS mask. */
export default function Wordmark({ className = "", large = false }: { className?: string; large?: boolean }) {
  const src = large ? big : small;
  return (
    <span
      role="img"
      aria-label="Aawaiz Soomro"
      className={`inline-block aspect-[1680/733] bg-current ${className}`}
      style={{
        maskImage: `url(${src})`,
        WebkitMaskImage: `url(${src})`,
        maskSize: "contain",
        WebkitMaskSize: "contain",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
      }}
    />
  );
}

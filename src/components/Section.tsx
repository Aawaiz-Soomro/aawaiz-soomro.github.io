// Section.tsx
export default function Section({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`py-12 md:py-16 lg:py-24 ${className}`}
    >
      {children}
    </section>
  );
}
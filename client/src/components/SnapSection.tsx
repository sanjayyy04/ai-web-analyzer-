import type { ReactNode } from "react";

type SnapSectionProps = {
  id?: string;
  children: ReactNode;
  className?: string;
  /** screen = one viewport panel; auto = at least one screen, can grow (results, guides) */
  size?: "screen" | "auto";
  innerClassName?: string;
};

export function SnapSection({
  id,
  children,
  className = "",
  size = "screen",
  innerClassName = "",
}: SnapSectionProps) {
  return (
    <section
      id={id}
      className={`snap-section flex w-full flex-col justify-center scroll-mt-[4.5rem] ${
        size === "screen" ? "snap-section-screen" : "snap-section-auto"
      } ${className}`}
    >
      <div className={`mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8 ${innerClassName}`}>
        {children}
      </div>
    </section>
  );
}

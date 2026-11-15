import { Children, useEffect, useRef, useState, type ReactNode } from "react";

export function ResponsiveCarousel({
  ariaLabel,
  children,
  className = "",
}: {
  ariaLabel: string;
  children: ReactNode;
  className?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const slides = Children.toArray(children);
  const [activeIndex, setActiveIndex] = useState(0);

  function scrollToSlide(index: number) {
    const track = trackRef.current;
    const slide = track?.children.item(index);
    if (!track || !(slide instanceof HTMLElement)) return;

    track.scrollTo({
      left: track.scrollLeft + slide.getBoundingClientRect().left - track.getBoundingClientRect().left,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  }

  function updateActiveSlide() {
    const track = trackRef.current;
    if (!track) return;
    if (animationFrameRef.current !== null) {
      window.cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = window.requestAnimationFrame(() => {
      const currentTrack = trackRef.current;
      if (!currentTrack) return;
      const trackLeft = currentTrack.getBoundingClientRect().left;
      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      Array.from(currentTrack.children).forEach((slide, index) => {
        const distance = Math.abs(slide.getBoundingClientRect().left - trackLeft);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      setActiveIndex(closestIndex);
    });
  }

  useEffect(
    () => () => {
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
    },
    [],
  );

  return (
    <div className="responsive-carousel" role="region" aria-label={ariaLabel} aria-roledescription="carousel">
      <div
        ref={trackRef}
        className={`responsive-carousel-track ${className}`}
        onScroll={updateActiveSlide}
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            className="responsive-carousel-slide"
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${slides.length}`}
          >
            {slide}
          </div>
        ))}
      </div>

      {slides.length > 1 && (
        <div className="responsive-carousel-controls" aria-label="Carousel controls">
          <button
            type="button"
            className="carousel-arrow"
            onClick={() => scrollToSlide(activeIndex - 1)}
            disabled={activeIndex === 0}
            aria-label="Previous slide"
          >
            <CarouselArrow previous />
          </button>
          <div className="carousel-dots" aria-label="Choose a slide">
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                className={`carousel-dot ${activeIndex === index ? "is-active" : ""}`}
                onClick={() => scrollToSlide(index)}
                aria-label={`Show slide ${index + 1} of ${slides.length}`}
                aria-pressed={activeIndex === index}
              />
            ))}
          </div>
          <span className="carousel-count" aria-live="polite">
            {activeIndex + 1} / {slides.length}
          </span>
          <button
            type="button"
            className="carousel-arrow"
            onClick={() => scrollToSlide(activeIndex + 1)}
            disabled={activeIndex === slides.length - 1}
            aria-label="Next slide"
          >
            <CarouselArrow />
          </button>
        </div>
      )}
    </div>
  );
}

function CarouselArrow({ previous = false }: { previous?: boolean }) {
  return (
    <svg
      className={`h-4 w-4 ${previous ? "rotate-180" : ""}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  );
}

"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { BookingEntryLink } from "@/components/booking/BookingEntryLink";
const items = [
  { title: "Pain, joint pain & stiffness", reason: "Pain consultation" },
  { title: "Arthritis consultation", reason: "Arthritis consultation" },
  { title: "Autoimmune & lupus care", reason: "Autoimmune consultation" },
  { title: "Gout treatment", reason: "Gout treatment" },
  { title: "Rheumatology consultation", reason: "Rheumatology consultation" },
  { title: "Follow-up consultation", reason: "Follow-up consultation" },
];
export function CareRail() {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({
    first: 1,
    last: 4,
    start: true,
    end: false,
  });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    function update() {
      if (!el) return;
      const cards = Array.from(el.children) as HTMLElement[];
      const visible = cards
        .map((c, i) => ({
          i,
          left: c.offsetLeft - el.offsetLeft,
          right: c.offsetLeft - el.offsetLeft + c.offsetWidth,
        }))
        .filter(
          (c) =>
            c.right > el.scrollLeft + 1 &&
            c.left < el.scrollLeft + el.clientWidth - 1,
        );
      setPosition({
        first: (visible[0]?.i ?? 0) + 1,
        last: (visible.at(-1)?.i ?? 0) + 1,
        start: el.scrollLeft < 2,
        end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 2,
      });
    }
    update();
    el.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, []);
  function move(direction: number) {
    const el = ref.current;
    if (el)
      el.scrollBy({
        left: direction * (el.children[0].getBoundingClientRect().width + 24),
        behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
  }
  return (
    <section
      id="services"
      className="clinic-care-rail clinic-dark clinic-rounded"
    >
      <div className="clinic-container">
        <p className="clinic-eyebrow">Areas of care</p>
        <h2 className="clinic-title">Explore our areas of care.</h2>
        <div
          ref={ref}
          className="clinic-care-scroll"
          tabIndex={0}
          aria-label="Areas of care"
        >
          <>
            {items.map((item) => (
              <BookingEntryLink
                key={item.reason}
                seed={{ reason: item.reason }}
                className="clinic-care-tile"
              >
                <div
                  className="clinic-media-slot"
                  data-media-review="pending"
                  aria-hidden="true"
                />
                <div className="clinic-care-tile-label">
                  <span>{item.title}</span>
                  <ArrowUpRight aria-hidden />
                </div>
              </BookingEntryLink>
            ))}
          </>
        </div>
        <div className="clinic-rail-controls">
          <span aria-live="polite">
            {position.first}–{position.last} / {items.length}
          </span>
          <div>
            <button
              type="button"
              className="clinic-circle"
              onClick={() => move(-1)}
              disabled={position.start}
              aria-label="Previous care area"
            >
              <ArrowLeft aria-hidden />
            </button>
            <button
              type="button"
              className="clinic-circle"
              onClick={() => move(1)}
              disabled={position.end}
              aria-label="Next care area"
            >
              <ArrowRight aria-hidden />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

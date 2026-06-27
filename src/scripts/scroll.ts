type NullableElement<T extends Element> = T | null;

const heroTitle = document.querySelector<HTMLElement>("[data-hero-title]");
const ghostTitle = document.querySelector<HTMLElement>("[data-ghost-title]");
const allsortsLayer = document.querySelector<HTMLElement>("[data-image-layer='allsorts']");
const beansLayer = document.querySelector<HTMLElement>("[data-image-layer='beans']");
const introSection = document.querySelector<HTMLElement>("[data-intro-section]");
const headingSection = document.querySelector<HTMLElement>("[data-contact-heading-section]");
const contactHeading = document.querySelector<HTMLElement>("[data-contact-heading]");
const contactSection = document.querySelector<HTMLElement>("[data-contact-section]");

const requiredNodes: NullableElement<HTMLElement>[] = [
  heroTitle,
  ghostTitle,
  allsortsLayer,
  beansLayer,
  introSection,
  headingSection,
  contactHeading,
  contactSection,
];

const prefersStatic = window.matchMedia("(prefers-reduced-motion: reduce), (pointer: coarse)");

let viewportHeight = window.innerHeight;
let introTop = 0;
let headingTop = 0;
let contactTop = 0;
let ticking = false;

const usesCssTitleTimeline = CSS.supports("animation-timeline: scroll()");

function px(value: number): string {
  return `${value}px`;
}

function documentTop(element: HTMLElement): number {
  return element.getBoundingClientRect().top + window.scrollY;
}

function measure(): void {
  viewportHeight = window.innerHeight;

  if (!introSection || !headingSection || !contactHeading || !contactSection) {
    return;
  }

  introTop = documentTop(introSection);
  headingTop = documentTop(headingSection);
  contactTop = documentTop(contactSection);

}

function setStaticLayout(): void {
  if (!usesCssTitleTimeline) {
    heroTitle?.style.setProperty("transform", "translate3d(0, 0, 0)");
    ghostTitle?.style.setProperty("transform", "translate3d(0, 0, 0)");
  }

  allsortsLayer?.style.setProperty("transform", "translate3d(0, 0, 0)");
  beansLayer?.style.setProperty("transform", "translate3d(0, 0, 0)");

  if (contactHeading) {
    contactHeading.classList.add("is-solid");
  }
}

function positionTitles(scrollY: number): void {
  if (!heroTitle || !ghostTitle) {
    return;
  }

  const trigger = viewportHeight * 0.5;
  const viewportShift = scrollY < trigger ? 0 : (trigger - scrollY) * 0.5;

  heroTitle.style.transform = `translate3d(0, ${px(scrollY + viewportShift)}, 0)`;
  ghostTitle.style.transform = `translate3d(0, ${px(viewportShift)}, 0)`;
}

function positionImages(scrollY: number): void {
  if (!allsortsLayer || !beansLayer) {
    return;
  }

  const allsortsStart = introTop - viewportHeight;
  const allsortsShift = Math.max(0, scrollY - allsortsStart) * 0.375;
  const beansShift = Math.max(0, scrollY - headingTop) * 0.375;

  allsortsLayer.hidden = scrollY > introTop;
  allsortsLayer.style.transform = `translate3d(0, ${px(-allsortsShift)}, 0)`;
  beansLayer.style.transform = `translate3d(0, ${px(-beansShift)}, 0)`;
}

function positionHeading(scrollY: number): void {
  if (!contactHeading) {
    return;
  }

  const headingRect = contactHeading.getBoundingClientRect();
  const isHeadingActive = scrollY > headingTop && scrollY < contactTop;
  contactHeading.classList.toggle("is-solid", isHeadingActive && headingRect.top <= 0);
}

function render(): void {
  ticking = false;

  if (prefersStatic.matches) {
    setStaticLayout();
    return;
  }

  const scrollY = window.scrollY;
  if (!usesCssTitleTimeline) {
    positionTitles(scrollY);
  }
  positionImages(scrollY);
  positionHeading(scrollY);
}

function requestRender(): void {
  if (!ticking) {
    ticking = true;
    window.requestAnimationFrame(render);
  }
}

function refresh(): void {
  measure();
  requestRender();
}

if (requiredNodes.every(Boolean)) {
  refresh();
  window.addEventListener("scroll", requestRender, { passive: true });
  window.addEventListener("resize", refresh);
  prefersStatic.addEventListener("change", refresh);
  window.addEventListener("load", refresh, { once: true });
}

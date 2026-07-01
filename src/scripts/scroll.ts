type NullableElement<T extends Element> = T | null;

const heroTitle = document.querySelector<HTMLElement>("[data-hero-title]");
const ghostTitle = document.querySelector<HTMLElement>("[data-ghost-title]");
const codeLayer = document.querySelector<HTMLElement>("[data-image-layer='code']");
const dashLayer = document.querySelector<HTMLElement>("[data-image-layer='dash']");
const introSection = document.querySelector<HTMLElement>("[data-intro-section]");
const headingSection = document.querySelector<HTMLElement>("[data-contact-heading-section]");
const contactHeading = document.querySelector<HTMLElement>("[data-contact-heading]");
const contactSection = document.querySelector<HTMLElement>("[data-contact-section]");
const HERO_TITLE_RELEASE_VIEWPORTS = 1;
const userAgent = navigator.userAgent.toLowerCase();
const isMacSafari =
  userAgent.includes("mac") &&
  userAgent.includes("safari") &&
  !userAgent.includes("chrome");
const usesLegacyStaticVersion = [
  "ipad",
  "iphone",
  "ipod",
  "android",
  "windows phone",
  "touch",
  "blackberry",
  "edge",
  "trident",
].some((device) => userAgent.includes(device)) || isMacSafari;

const requiredNodes: NullableElement<HTMLElement>[] = [
  heroTitle,
  ghostTitle,
  codeLayer,
  dashLayer,
  introSection,
  headingSection,
  contactHeading,
  contactSection,
];

const staticLayoutQuery = window.matchMedia("(prefers-reduced-motion: reduce), (pointer: coarse)");

let viewportHeight = window.innerHeight;
let introTop = 0;
let headingTop = 0;
let headingHeight = 0;
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

  const headingStyles = window.getComputedStyle(contactHeading);
  headingHeight =
    Number.parseFloat(headingStyles.lineHeight) +
    Number.parseFloat(headingStyles.paddingTop) * 2;
}

function shouldUseStaticLayout(): boolean {
  return usesLegacyStaticVersion || staticLayoutQuery.matches;
}

function setStaticLayout(scrollY: number): void {
  document.body.classList.add("is-static-layout");
  updateSceneVisibility(scrollY);

  if (!usesCssTitleTimeline) {
    heroTitle?.style.setProperty("transform", "translate3d(0, 0, 0)");
    ghostTitle?.style.setProperty("transform", "translate3d(0, 0, 0)");
  }

  codeLayer?.style.setProperty("transform", "translate3d(0, 0, 0)");
  dashLayer?.style.setProperty("transform", "translate3d(0, 0, 0)");

  if (contactHeading) {
    contactHeading.classList.remove("is-solid");
    contactHeading.style.top = px(viewportHeight * 0.2);
    contactHeading.style.marginTop = "0";
    contactHeading.style.opacity = "1";
  }
}

function clearStaticLayout(): void {
  document.body.classList.remove("is-static-layout");
  contactHeading?.style.removeProperty("opacity");
}

function updateSceneVisibility(scrollY: number): void {
  const showHeroScene = scrollY <= introTop;

  if (ghostTitle) {
    ghostTitle.hidden = !showHeroScene;
  }

  if (codeLayer) {
    codeLayer.hidden = !showHeroScene;
  }
}

function positionTitles(scrollY: number): void {
  if (!heroTitle || !ghostTitle) {
    return;
  }

  const trigger = viewportHeight * HERO_TITLE_RELEASE_VIEWPORTS;
  const viewportShift = scrollY < trigger ? 0 : (trigger - scrollY) * 0.5;

  heroTitle.style.transform = `translate3d(0, ${px(scrollY + viewportShift)}, 0)`;
  ghostTitle.style.transform = `translate3d(0, ${px(viewportShift)}, 0)`;
}

function positionImages(scrollY: number): void {
  if (!codeLayer || !dashLayer) {
    return;
  }

  const codeStart = introTop - viewportHeight;
  const codeShift = Math.max(0, scrollY - codeStart) * 0.375;
  const dashShift = Math.max(0, scrollY - headingTop) * 0.375;

  codeLayer.style.transform = `translate3d(0, ${px(-codeShift)}, 0)`;
  dashLayer.style.transform = `translate3d(0, ${px(-dashShift)}, 0)`;
}

function positionHeading(scrollY: number): void {
  if (!contactHeading) {
    return;
  }

  if (scrollY >= contactTop) {
    contactHeading.classList.remove("is-solid");
    return;
  }

  if (scrollY > headingTop + headingHeight) {
    contactHeading.style.top = "0";
    contactHeading.style.marginTop = "0";
    contactHeading.classList.add("is-solid");
    return;
  }

  contactHeading.classList.remove("is-solid");

  if (scrollY > introTop) {
    const headingShift = scrollY - headingTop;
    contactHeading.style.top = px(headingShift * 0.5 + headingHeight * 0.5);
    contactHeading.style.marginTop = "0";
  } else {
    contactHeading.style.top = "0";
    contactHeading.style.marginTop = "0";
  }
}

function render(): void {
  ticking = false;

  const scrollY = window.scrollY;

  if (shouldUseStaticLayout()) {
    setStaticLayout(scrollY);
    return;
  }

  clearStaticLayout();
  updateSceneVisibility(scrollY);

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
  staticLayoutQuery.addEventListener("change", refresh);
  window.addEventListener("load", refresh, { once: true });
}

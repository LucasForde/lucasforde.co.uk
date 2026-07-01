const loader = document.querySelector<HTMLElement>("[data-loader]");
const preload = document.querySelector<HTMLElement>("[data-loader-preload]");
const loadanim = document.querySelector<HTMLElement>("[data-loadanim]");
const loaderDots = Array.from(document.querySelectorAll<HTMLElement>("[data-loader-dot]"));

const dotShowDelays = [250, 300, 350, 400, 450, 500, 550, 600];
const dotHideDelays = [1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800];
const cycleDuration = 1800;
const lingerDuration = 2000;
const exitDuration = 1000;
const timers: number[] = [];
let isCleanedUp = false;

function resetScroll(): void {
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

function clearTimers(): void {
  for (const timer of timers) {
    window.clearTimeout(timer);
  }
}

function queue(callback: () => void, delay: number): void {
  timers.push(window.setTimeout(callback, delay));
}

function animateLoaderDots(): void {
  loaderDots.forEach((dot, index) => {
    queue(() => {
      dot.classList.add("is-visible");
    }, dotShowDelays[index]);

    queue(() => {
      dot.classList.remove("is-visible");
    }, dotHideDelays[index]);
  });

  queue(animateLoaderDots, cycleDuration);
}

function cleanupLoader(): void {
  if (isCleanedUp) {
    return;
  }

  isCleanedUp = true;
  resetScroll();
  clearTimers();
  document.body.classList.remove("is-loading");
  loader?.remove();
  preload?.remove();
}

function exitLoader(): void {
  resetScroll();

  loadanim?.addEventListener(
    "transitionend",
    (event) => {
      if (event.propertyName === "transform") {
        cleanupLoader();
      }
    },
    { once: true },
  );

  document.body.classList.add("is-loaded");

  queue(cleanupLoader, exitDuration + 100);
}

function startExitTimer(): void {
  queue(exitLoader, lingerDuration);
}

if (loader) {
  if ("scrollRestoration" in window.history) {
    window.history.scrollRestoration = "manual";
  }

  resetScroll();
  animateLoaderDots();

  if (document.readyState === "complete") {
    startExitTimer();
  } else {
    window.addEventListener("load", startExitTimer, { once: true });
  }
}

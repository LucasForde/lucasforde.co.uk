import { expect, test, type Page } from "@playwright/test";

async function openLoadedPage(page: Page): Promise<void> {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await page.waitForSelector("[data-loader]", { state: "detached", timeout: 6000 });
}

function isZeroTransform(transform: string): boolean {
  return transform === "none" || transform === "matrix(1, 0, 0, 1, 0, 0)";
}

test("loader lingers, exits upward, and releases the hero title", async ({ page, isMobile }) => {
  test.skip(isMobile, "Loader motion is covered on desktop.");

  await page.goto("/", { waitUntil: "domcontentloaded" });

  const loader = page.locator("[data-loader]");
  await expect(loader).toBeVisible();

  const initial = await page.evaluate(() => {
    const title = document.querySelector<HTMLElement>("[data-hero-title]");
    const dots = document.querySelectorAll("[data-loader-dot]");

    if (!title) {
      return null;
    }

    return {
      dotCount: dots.length,
      htmlLoading: document.documentElement.classList.contains("is-loading"),
      bodyOverflowY: window.getComputedStyle(document.body).overflowY,
      htmlOverflowY: window.getComputedStyle(document.documentElement).overflowY,
      titleTop: title.getBoundingClientRect().top,
      viewportHeight: window.innerHeight,
    };
  });

  expect(initial).not.toBeNull();
  expect(initial?.dotCount).toBe(8);
  expect(initial?.htmlLoading).toBe(true);
  expect(initial?.htmlOverflowY).toBe("scroll");
  expect(initial?.bodyOverflowY).not.toBe("hidden");
  expect(initial?.titleTop ?? 0).toBeGreaterThan((initial?.viewportHeight ?? 0) * 0.9);

  await page.mouse.wheel(0, 1000);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);

  await page.waitForFunction(() => document.body.classList.contains("is-loaded"));
  await page.waitForTimeout(500);

  const exiting = await page.evaluate(() => {
    const loader = document.querySelector<HTMLElement>("[data-loader]");
    const loadanim = document.querySelector<HTMLElement>("[data-loadanim]");
    const title = document.querySelector<HTMLElement>("[data-hero-title]");

    if (!loader || !loadanim || !title) {
      return null;
    }

    return {
      loaderTop: window.getComputedStyle(loader).top,
      loadanimTransform: window.getComputedStyle(loadanim).transform,
      titleTop: title.getBoundingClientRect().top,
      viewportHeight: window.innerHeight,
    };
  });

  expect(exiting).not.toBeNull();
  expect(exiting?.loaderTop).toBe("0px");
  expect(exiting?.loadanimTransform).not.toBe("none");
  expect(exiting?.titleTop ?? 999).toBeLessThan((exiting?.viewportHeight ?? 0) * 0.9);

  await page.waitForSelector("[data-loader]", { state: "detached", timeout: 6000 });

  const finalState = await page.evaluate(() => {
    const title = document.querySelector<HTMLElement>("[data-hero-title]");
    return {
      htmlLoading: document.documentElement.classList.contains("is-loading"),
      bodyLoading: document.body.classList.contains("is-loading"),
      titleTop: title?.getBoundingClientRect().top ?? null,
    };
  });

  expect(finalState.titleTop).not.toBeNull();
  expect(finalState.htmlLoading).toBe(false);
  expect(finalState.bodyLoading).toBe(false);
  expect(Math.abs(finalState.titleTop ?? 999)).toBeLessThan(1);
});

test("loader refresh starts and finishes at the top of the page", async ({ page, isMobile }) => {
  test.skip(isMobile, "Loader motion is covered on desktop.");

  await openLoadedPage(page);
  await page.evaluate(() => window.scrollTo(0, window.innerHeight * 1.5));
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);

  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.locator("[data-loader]")).toBeVisible();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);

  await page.waitForSelector("[data-loader]", { state: "detached", timeout: 6000 });
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
});

test("static layout matches the original mobile branch", async ({ page, isMobile }) => {
  test.skip(!isMobile, "Static layout is covered on mobile/coarse-pointer devices.");

  await openLoadedPage(page);

  const initial = await page.evaluate(() => {
    const hero = document.querySelector<HTMLElement>("[data-hero]");
    const heading = document.querySelector<HTMLElement>("[data-contact-heading]");
    const heroTitle = document.querySelector<HTMLElement>("[data-hero-title]");
    const introSection = document.querySelector<HTMLElement>("[data-intro-section]");
    const topImageLayer = document.querySelector<HTMLElement>("[data-image-layer='dash']");
    const bottomImageLayer = document.querySelector<HTMLElement>("[data-image-layer='code']");
    const ghostTitle = document.querySelector<HTMLElement>("[data-ghost-title]");

    if (!hero || !heading || !heroTitle || !introSection || !topImageLayer || !bottomImageLayer || !ghostTitle) {
      return null;
    }

    const heroStyles = window.getComputedStyle(hero);
    const headingStyles = window.getComputedStyle(heading);
    const heroTitleStyles = window.getComputedStyle(heroTitle);
    const topImageStyles = window.getComputedStyle(topImageLayer);
    const bottomImageStyles = window.getComputedStyle(bottomImageLayer);
    const heroRect = hero.getBoundingClientRect();
    const heroTitleRect = heroTitle.getBoundingClientRect();
    const introRect = introSection.getBoundingClientRect();

    return {
      bodyStatic: document.body.classList.contains("is-static-layout"),
      heroBackgroundImage: heroStyles.backgroundImage,
      heroBackgroundColor: heroStyles.backgroundColor,
      heroTitleCenter: heroTitleRect.top + heroTitleRect.height / 2,
      heroTitleTextAlign: heroTitleStyles.textAlign,
      introGap: introRect.top - heroRect.bottom,
      headingTop: Number.parseFloat(headingStyles.top),
      headingOpacity: headingStyles.opacity,
      headingPosition: headingStyles.position,
      viewportHeight: window.innerHeight,
      topImageTransform: topImageStyles.transform,
      bottomImageTransform: bottomImageStyles.transform,
      topImageHidden: topImageLayer.hidden,
      bottomImageHidden: bottomImageLayer.hidden,
      ghostHidden: ghostTitle.hidden,
    };
  });

  expect(initial).not.toBeNull();
  expect(initial?.bodyStatic).toBe(true);
  expect(initial?.heroBackgroundImage).toContain("bg_dash.jpg");
  expect(initial?.heroBackgroundColor).toBe("rgb(51, 51, 51)");
  expect(initial?.heroTitleTextAlign).toBe("center");
  expect(Math.abs((initial?.heroTitleCenter ?? 0) - (initial?.viewportHeight ?? 0) * 0.5)).toBeLessThan(1);
  expect(Math.abs(initial?.introGap ?? 999)).toBeLessThan(1);
  expect(initial?.headingPosition).not.toBe("fixed");
  expect(initial?.headingOpacity).toBe("1");
  expect(Math.abs((initial?.headingTop ?? 0) - (initial?.viewportHeight ?? 0) * 0.2)).toBeLessThan(1);
  expect(isZeroTransform(initial?.topImageTransform ?? "")).toBe(true);
  expect(isZeroTransform(initial?.bottomImageTransform ?? "")).toBe(true);
  expect(initial?.topImageHidden).toBe(false);
  expect(initial?.bottomImageHidden).toBe(false);
  expect(initial?.ghostHidden).toBe(false);

  const afterIntro = await page.evaluate(async () => {
    const introSection = document.querySelector<HTMLElement>("[data-intro-section]");
    const topImageLayer = document.querySelector<HTMLElement>("[data-image-layer='dash']");
    const bottomImageLayer = document.querySelector<HTMLElement>("[data-image-layer='code']");
    const ghostTitle = document.querySelector<HTMLElement>("[data-ghost-title]");
    const heading = document.querySelector<HTMLElement>("[data-contact-heading]");
    const nextFrame = () => new Promise((resolve) => window.requestAnimationFrame(resolve));

    if (!introSection || !topImageLayer || !bottomImageLayer || !ghostTitle || !heading) {
      return null;
    }

    const introTop = introSection.getBoundingClientRect().top + window.scrollY;
    window.scrollTo(0, introTop + 1);
    await nextFrame();
    await nextFrame();

    return {
      topImageHidden: topImageLayer.hidden,
      bottomImageHidden: bottomImageLayer.hidden,
      ghostHidden: ghostTitle.hidden,
      headingPosition: window.getComputedStyle(heading).position,
      headingOpacity: window.getComputedStyle(heading).opacity,
    };
  });

  expect(afterIntro).toEqual({
    topImageHidden: true,
    bottomImageHidden: false,
    ghostHidden: true,
    headingPosition: "relative",
    headingOpacity: "1",
  });

  const atBottom = await page.evaluate(async () => {
    const contactCopy = document.querySelector<HTMLElement>(".copy--contact");
    const nextFrame = () => new Promise((resolve) => window.requestAnimationFrame(resolve));

    if (!contactCopy) {
      return null;
    }

    window.scrollTo(0, document.documentElement.scrollHeight);
    await nextFrame();
    await nextFrame();

    const rect = contactCopy.getBoundingClientRect();

    return {
      copyTop: rect.top,
      copyBottom: rect.bottom,
      viewportHeight: window.innerHeight,
    };
  });

  expect(atBottom).not.toBeNull();
  expect(atBottom?.copyTop ?? -1).toBeGreaterThanOrEqual(0);
  expect(atBottom?.copyBottom ?? 99999).toBeLessThanOrEqual(atBottom?.viewportHeight ?? 0);
});

test("hero title copies stay aligned through the handoff", async ({ page, isMobile }) => {
  test.skip(isMobile, "Desktop scroll choreography switches to a static layout on mobile.");

	await openLoadedPage(page);

	const samples = await page.evaluate(async () => {
		const heroTitle = document.querySelector("[data-hero-title]");
		const ghostTitle = document.querySelector("[data-ghost-title]");
		const values: number[] = [];
		const nextFrame = () => new Promise((resolve) => window.requestAnimationFrame(resolve));

		if (!heroTitle || !ghostTitle) {
			return values;
		}

		for (const y of [0, 150, 350, 600, 900]) {
			window.scrollTo(0, y);
			await nextFrame();
			await nextFrame();
			const heroTop = heroTitle.getBoundingClientRect().top;
			const ghostTop = ghostTitle.getBoundingClientRect().top;
			values.push(Math.abs(heroTop - ghostTop));
    }

    return values;
  });

  for (const delta of samples) {
    expect(delta).toBeLessThan(1);
  }
});

test("hero title stays locked until the ghost title is fully revealed", async ({ page, isMobile }) => {
  test.skip(isMobile, "Desktop scroll choreography switches to a static layout on mobile.");

  await openLoadedPage(page);

  const result = await page.evaluate(async () => {
    const heroTitle = document.querySelector<HTMLElement>("[data-hero-title]");
    const ghostTitle = document.querySelector<HTMLElement>("[data-ghost-title]");
    const nextFrame = () => new Promise((resolve) => window.requestAnimationFrame(resolve));

    if (!heroTitle || !ghostTitle) {
      return null;
    }

    const releasePoint = window.innerHeight;
    const samples = [];

    for (const y of [releasePoint * 0.5, releasePoint * 0.95, releasePoint * 1.25]) {
      window.scrollTo(0, y);
      await nextFrame();
      await nextFrame();
      samples.push({
        heroTop: heroTitle.getBoundingClientRect().top,
        ghostTop: ghostTitle.getBoundingClientRect().top,
      });
    }

    return samples;
  });

  expect(result).not.toBeNull();
  expect(Math.abs(result?.[0].heroTop ?? 999)).toBeLessThan(1);
  expect(Math.abs(result?.[0].ghostTop ?? 999)).toBeLessThan(1);
  expect(Math.abs(result?.[1].heroTop ?? 999)).toBeLessThan(1);
  expect(Math.abs(result?.[1].ghostTop ?? 999)).toBeLessThan(1);
  expect(result?.[2].heroTop ?? 0).toBeLessThan(-10);
  expect(Math.abs((result?.[2].heroTop ?? 999) - (result?.[2].ghostTop ?? 0))).toBeLessThan(1);
});

test("hero ghost title is hidden before the contact image scene", async ({ page, isMobile }) => {
  test.skip(isMobile, "Desktop scroll choreography switches to a static layout on mobile.");

  await openLoadedPage(page);

  const result = await page.evaluate(async () => {
    const introSection = document.querySelector<HTMLElement>("[data-intro-section]");
    const ghostTitle = document.querySelector<HTMLElement>("[data-ghost-title]");
    const topImageLayer = document.querySelector<HTMLElement>("[data-image-layer='dash']");
    const bottomImageLayer = document.querySelector<HTMLElement>("[data-image-layer='code']");
    const nextFrame = () => new Promise((resolve) => window.requestAnimationFrame(resolve));

    if (!introSection || !ghostTitle || !topImageLayer || !bottomImageLayer) {
      return null;
    }

    const introTop = introSection.getBoundingClientRect().top + window.scrollY;
    window.scrollTo(0, introTop + 1);
    await nextFrame();
    await nextFrame();

    return {
      ghostHidden: ghostTitle.hidden,
      topImageHidden: topImageLayer.hidden,
      bottomImageHidden: bottomImageLayer.hidden,
    };
  });

  expect(result).toEqual({
    ghostHidden: true,
    topImageHidden: true,
    bottomImageHidden: false,
  });
});

test("contact heading approaches at parallax speed before locking", async ({ page, isMobile }) => {
  test.skip(isMobile, "Desktop scroll choreography switches to a static layout on mobile.");

  await openLoadedPage(page);

  const result = await page.evaluate(async () => {
    const heading = document.querySelector<HTMLElement>("[data-contact-heading]");
    const headingSection = document.querySelector<HTMLElement>("[data-contact-heading-section]");
    const nextFrame = () => new Promise((resolve) => window.requestAnimationFrame(resolve));

    if (!heading || !headingSection) {
      return null;
    }

    const headingTop = headingSection.getBoundingClientRect().top + window.scrollY;
    const samples = [];

    for (const y of [headingTop - 300, headingTop - 100]) {
      window.scrollTo(0, y);
      await nextFrame();
      await nextFrame();
      samples.push({
        scrollY: window.scrollY,
        top: heading.getBoundingClientRect().top,
        opacity: window.getComputedStyle(heading).opacity,
        fixed: window.getComputedStyle(heading).position === "fixed",
      });
    }

    return {
      scrollDelta: samples[1].scrollY - samples[0].scrollY,
      headingDelta: samples[0].top - samples[1].top,
      samples,
    };
  });

  expect(result).not.toBeNull();
  expect(result?.samples.every((sample) => sample.opacity === "0.3")).toBe(true);
  expect(result?.samples.every((sample) => !sample.fixed)).toBe(true);
  expect(result?.headingDelta ?? 0).toBeGreaterThan((result?.scrollDelta ?? 0) * 0.45);
  expect(result?.headingDelta ?? 0).toBeLessThan((result?.scrollDelta ?? 0) * 0.55);
});

test("contact panel does not jump when contact heading locks", async ({ page, isMobile }) => {
  test.skip(isMobile, "Desktop scroll choreography switches to a static layout on mobile.");

  await openLoadedPage(page);

  const result = await page.evaluate(async () => {
    const heading = document.querySelector<HTMLElement>("[data-contact-heading]");
    const headingSection = document.querySelector<HTMLElement>("[data-contact-heading-section]");
    const contactSection = document.querySelector<HTMLElement>("[data-contact-section]");
    const nextFrame = () => new Promise((resolve) => window.requestAnimationFrame(resolve));

    if (!heading || !headingSection || !contactSection) {
      return null;
    }

    const styles = window.getComputedStyle(heading);
    const height = Number.parseFloat(styles.lineHeight) + Number.parseFloat(styles.paddingTop) * 2;
    const headingTop = headingSection.getBoundingClientRect().top + window.scrollY;
    const threshold = headingTop + height;
    const samples = [];

    for (const y of [threshold - 1, threshold + 1]) {
      window.scrollTo(0, y);
      await nextFrame();
      await nextFrame();

      samples.push({
        scrollY: window.scrollY,
        contactTop: contactSection.getBoundingClientRect().top,
        headingFixed: window.getComputedStyle(heading).position === "fixed",
      });
    }

    return {
      scrollDelta: samples[1].scrollY - samples[0].scrollY,
      contactDelta: samples[0].contactTop - samples[1].contactTop,
      samples,
    };
  });

  expect(result).not.toBeNull();
  expect(result?.samples[0].headingFixed).toBe(false);
  expect(result?.samples[1].headingFixed).toBe(true);
  expect(Math.abs((result?.contactDelta ?? 0) - (result?.scrollDelta ?? 0))).toBeLessThan(1);
});

test("contact heading fades from image heading to fixed solid heading", async ({ page, isMobile }) => {
  test.skip(isMobile, "Desktop scroll choreography switches to a static layout on mobile.");

	await openLoadedPage(page);

  const result = await page.evaluate(async () => {
    const heading = document.querySelector<HTMLElement>("[data-contact-heading]");
    const headingSection = document.querySelector<HTMLElement>("[data-contact-heading-section]");

    if (!heading || !headingSection) {
      return null;
    }

    const styles = window.getComputedStyle(heading);
    const height = Number.parseFloat(styles.lineHeight) + Number.parseFloat(styles.paddingTop) * 2;
    const headingTop = headingSection.getBoundingClientRect().top + window.scrollY;

    window.scrollTo(0, headingTop + height * 0.5);
    await new Promise((resolve) => window.requestAnimationFrame(resolve));
    const transparentOpacity = window.getComputedStyle(heading).opacity;

    window.scrollTo(0, headingTop + height + 20);
    await new Promise((resolve) => window.requestAnimationFrame(resolve));
    const fixedRect = heading.getBoundingClientRect();
    const fixedOpacity = window.getComputedStyle(heading).opacity;

    return {
      transparentOpacity,
      fixedOpacity,
      fixedTop: fixedRect.top,
    };
  });

  expect(result).not.toBeNull();
  expect(result?.transparentOpacity).toBe("0.3");
  expect(result?.fixedOpacity).toBe("1");
  expect(Math.abs(result?.fixedTop ?? 999)).toBeLessThan(1);
});

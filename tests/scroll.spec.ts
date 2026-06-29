import { expect, test } from "@playwright/test";

test("hero title copies stay aligned through the handoff", async ({ page, isMobile }) => {
  test.skip(isMobile, "Desktop scroll choreography switches to a static layout on mobile.");

	await page.goto("/");
	await page.waitForLoadState("networkidle");

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

  await page.goto("/");
  await page.waitForLoadState("networkidle");

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

  await page.goto("/");
  await page.waitForLoadState("networkidle");

  const result = await page.evaluate(async () => {
    const introSection = document.querySelector<HTMLElement>("[data-intro-section]");
    const ghostTitle = document.querySelector<HTMLElement>("[data-ghost-title]");
    const allsortsLayer = document.querySelector<HTMLElement>("[data-image-layer='allsorts']");
    const nextFrame = () => new Promise((resolve) => window.requestAnimationFrame(resolve));

    if (!introSection || !ghostTitle || !allsortsLayer) {
      return null;
    }

    const introTop = introSection.getBoundingClientRect().top + window.scrollY;
    window.scrollTo(0, introTop + 1);
    await nextFrame();
    await nextFrame();

    return {
      ghostHidden: ghostTitle.hidden,
      allsortsHidden: allsortsLayer.hidden,
    };
  });

  expect(result).toEqual({
    ghostHidden: true,
    allsortsHidden: true,
  });
});

test("contact heading approaches at parallax speed before locking", async ({ page, isMobile }) => {
  test.skip(isMobile, "Desktop scroll choreography switches to a static layout on mobile.");

  await page.goto("/");
  await page.waitForLoadState("networkidle");

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

  await page.goto("/");
  await page.waitForLoadState("networkidle");

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

	await page.goto("/");
  await page.waitForLoadState("networkidle");

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

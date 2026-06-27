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

export const STATIC_LAYOUT_MEDIA_QUERY = "(pointer: coarse)";

export const STATIC_LAYOUT_USER_AGENT_TOKENS = ["android", "iphone", "ipad", "ipod"] as const;

export function matchesStaticLayoutUserAgent(userAgent = navigator.userAgent): boolean {
  const normalizedUserAgent = userAgent.toLowerCase();

  return STATIC_LAYOUT_USER_AGENT_TOKENS.some((token) => normalizedUserAgent.includes(token));
}

export function getStaticLayoutQuery(): MediaQueryList {
  return window.matchMedia(STATIC_LAYOUT_MEDIA_QUERY);
}

export function shouldUseStaticLayout(staticLayoutQuery = getStaticLayoutQuery()): boolean {
  return matchesStaticLayoutUserAgent() || staticLayoutQuery.matches;
}

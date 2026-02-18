import type { Category, BreakingNewsItem } from "@/types";

export const SITE_NAME = "ALNN";
export const SITE_FULL_NAME = "Albanian News Network";
export const SITE_TAGLINE = "Lajmet më të reja nga Shqipëria";
export const SITE_DESCRIPTION =
  "Albanian News Network - Burimi juaj i besueshëm për lajmet më të reja nga Shqipëria dhe bota. Politikë, ekonomi, sport, teknologji dhe më shumë.";
export const SITE_URL = "https://alnn.al";
export const SITE_EMAIL = "info@alnn.al";
export const SITE_PHONE = "+355 4 123 4567";
export const SITE_ADDRESS = "Tiranë, Shqipëri";

export const ARTICLES_PER_PAGE = 9;

export const NAVIGATION_ITEMS = [
  { name: "Kryefaqja", href: "/" },
  { name: "Politikë", href: "/politike" },
  { name: "Ekonomi", href: "/ekonomi" },
  { name: "Sport", href: "/sport" },
  { name: "Teknologji", href: "/teknologji" },
  { name: "Botë", href: "/bote" },
  { name: "Kulturë", href: "/kulture" },
  { name: "Shëndetësi", href: "/shendetesi" },
  { name: "Opinion", href: "/opinion" },
] as const;

export const CATEGORIES: Category[] = [
  { name: "Politikë", slug: "politike", description: "Lajmet nga bota e politikës shqiptare dhe ndërkombëtare", count: 0 },
  { name: "Ekonomi", slug: "ekonomi", description: "Zhvillimet ekonomike, tregjet financiare dhe biznesi", count: 0 },
  { name: "Sport", slug: "sport", description: "Lajmet nga bota e sportit shqiptar dhe ndërkombëtar", count: 0 },
  { name: "Teknologji", slug: "teknologji", description: "Inovacione, teknologji dhe shkencë", count: 0 },
  { name: "Botë", slug: "bote", description: "Ngjarjet kryesore nga bota dhe gjeopolitika", count: 0 },
  { name: "Kulturë", slug: "kulture", description: "Art, kulturë, letërsi dhe tradita shqiptare", count: 0 },
  { name: "Shëndetësi", slug: "shendetesi", description: "Shëndetësia, mjekësia dhe mirëqenia", count: 0 },
  { name: "Opinion", slug: "opinion", description: "Editoriale, analiza dhe opinione nga ekspertët", count: 0 },
];

export const BREAKING_NEWS: BreakingNewsItem[] = [];

export const TRENDING_TOPICS: string[] = [];

export const SOCIAL_LINKS = {
  facebook: "https://facebook.com/alnn",
  twitter: "https://twitter.com/alnn",
  instagram: "https://instagram.com/alnn",
  youtube: "https://youtube.com/alnn",
};

export const getCategoryBySlug = (slug: string): Category | undefined =>
  CATEGORIES.find((c) => c.slug === slug);

export const getCategoryNameBySlug = (slug: string): string =>
  CATEGORIES.find((c) => c.slug === slug)?.name ?? slug;

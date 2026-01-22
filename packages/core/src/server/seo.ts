import type { Context, MiddlewareHandler } from "hono";

/**
 * Koda SEO: The Visibility Engine 🛰️📈
 * Part of Phase 9: SEO & Meta-Information Engine
 * Orchestrates metadata, OpenGraph, and automated discovery.
 * ทุก detail Zenith tetap aman.
 */

export interface KodaSEOConfig {
    title: string;
    description: string;
    baseUrl: string;
    siteName?: string;
    twitterHandle?: string;
    defaultOGImage?: string;
}

export interface PageMetadata extends Partial<KodaSEOConfig> {
    path?: string;
    image?: string;
    type?: "website" | "article" | "profile";
}

export class KodaSEO {
    private config: KodaSEOConfig;
    private sitemapEntries: string[] = [];

    constructor(config: KodaSEOConfig) {
        this.config = config;
    }

    /**
     * Generates a complete set of HTML meta tags.
     */
    generateTags(page: PageMetadata = {}): string {
        const title = page.title ? `${page.title} | ${this.config.title}` : this.config.title;
        const desc = page.description || this.config.description;
        const url = `${this.config.baseUrl}${page.path || ""}`;
        const image = page.image || this.config.defaultOGImage;

        return `
      <!-- Standard Metadata -->
      <title>${title}</title>
      <meta name="description" content="${desc}">
      <link rel="canonical" href="${url}">

      <!-- OpenGraph / Facebook -->
      <meta property="og:type" content="${page.type || "website"}">
      <meta property="og:url" content="${url}">
      <meta property="og:title" content="${title}">
      <meta property="og:description" content="${desc}">
      <meta property="og:site_name" content="${this.config.siteName || title}">
      ${image ? `<meta property="og:image" content="${image}">` : ""}

      <!-- Twitter -->
      <meta name="twitter:card" content="summary_large_image">
      <meta name="twitter:url" content="${url}">
      <meta name="twitter:title" content="${title}">
      <meta name="twitter:description" content="${desc}">
      ${this.config.twitterHandle ? `<meta name="twitter:site" content="${this.config.twitterHandle}">` : ""}
      ${image ? `<meta name="twitter:image" content="${image}">` : ""}
    `.trim();
    }

    /**
     * Automatically registers a path for the sitemap.
     */
    register(path: string) {
        if (!this.sitemapEntries.includes(path)) {
            this.sitemapEntries.push(path);
        }
    }

    /**
     * Generates the sitemap.xml content.
     */
    generateSitemap(): string {
        const lastMod = new Date().toISOString().split('T')[0];
        const urls = this.sitemapEntries
            .map(p => `  <url>\n    <loc>${this.config.baseUrl}${p}</loc>\n    <lastmod>${lastMod}</lastmod>\n  </url>`)
            .join("\n");

        return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`.trim();
    }

    /**
     * Generates the robots.txt content.
     */
    generateRobots(): string {
        return `
User-agent: *
Allow: /
Sitemap: ${this.config.baseUrl}/sitemap.xml
`.trim();
    }
}

/**
 * Koda SEO Middleware
 * Provides automated sitemap and robots.txt endpoints.
 */
export const kodaSEOMiddleware = (seo: KodaSEO): MiddlewareHandler => {
    return async (c, next) => {
        const path = c.req.path;

        if (path === "/sitemap.xml") {
            return c.body(seo.generateSitemap(), 200, { "Content-Type": "application/xml" });
        }

        if (path === "/robots.txt") {
            return c.text(seo.generateRobots());
        }

        await next();
    };
};

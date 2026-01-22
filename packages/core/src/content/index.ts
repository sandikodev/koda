import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { z } from 'zod';
import { marked } from 'marked';

/**
 * Koda Content: The Narrative Engine 📚⚡
 * Part of Phase 10: Content & Rendering Engine
 * Handles type-safe collections and high-speed MD/MDX processing.
 * ทุก detail Zenith tetap aman.
 */

export interface ContentEntry<T> {
    id: string;
    slug: string;
    data: T;
    body: string;
    html: string;
}

export class KodaContentCollection<T extends z.ZodRawShape> {
    private schema: z.ZodObject<T>;
    private directory: string;

    constructor(name: string, schema: T) {
        this.schema = z.object(schema);
        this.directory = path.join(process.cwd(), 'content', name);
    }

    /**
     * Reads and validates all entries in the collection.
     */
    async getAll(): Promise<ContentEntry<z.infer<z.ZodObject<T>>>[]> {
        try {
            const files = await fs.readdir(this.directory);
            const entries = await Promise.all(
                files
                    .filter(f => f.endsWith('.md') || f.endsWith('.mdx'))
                    .map(async (file) => {
                        const filePath = path.join(this.directory, file);
                        const content = await fs.readFile(filePath, 'utf-8');
                        const { data, content: body } = matter(content);
                        const slug = file.replace(/\.mdx?$/, '');

                        // Validate frontmatter
                        const validatedData = this.schema.parse(data);

                        // Render body to HTML
                        const html = await marked.parse(body);

                        return {
                            id: slug,
                            slug,
                            data: validatedData,
                            body,
                            html
                        };
                    })
            );

            return entries;
        } catch (error) {
            console.error(`[Koda Content] Failed to load collection: ${error}`);
            return [];
        }
    }

    /**
     * Gets a single entry by slug.
     */
    async get(slug: string): Promise<ContentEntry<z.infer<z.ZodObject<T>>> | null> {
        const entries = await this.getAll();
        return entries.find(e => e.slug === slug) || null;
    }
}

/**
 * RSS Feed Generator
 */
export class KodaFeed {
    private config: {
        title: string;
        description: string;
        id: string;
        link: string;
        language?: string;
        copyright?: string;
    };

    constructor(config: {
        title: string;
        description: string;
        id: string;
        link: string;
        language?: string;
        copyright?: string;
    }) {
        this.config = config;
    }

    generateRSS(entries: { title: string; description: string; link: string; date: Date }[]): string {
        const items = entries.map(item => `
    <item>
      <title>${item.title}</title>
      <link>${item.link}</link>
      <description>${item.description}</description>
      <pubDate>${item.date.toUTCString()}</pubDate>
      <guid>${item.link}</guid>
    </item>`).join('');

        return `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>${this.config.title}</title>
    <link>${this.config.link}</link>
    <description>${this.config.description}</description>
    <language>${this.config.language || 'en-us'}</language>
    <copyright>${this.config.copyright || ''}</copyright>
    ${items}
  </channel>
</rss>`.trim();
    }
}

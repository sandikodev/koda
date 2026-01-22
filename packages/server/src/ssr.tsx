import React from 'react';
import { renderToString } from 'react-dom/server';
import { KodaProvider } from '@koda/bridge';

/**
 * ⚛️ Koda SSR Engine
 * Renders Zenith pages and injects hydration scripts.
 */

export function renderZenithPage(Component: React.FC<any>, props: any = {}) {
    const html = renderToString(
        <KodaProvider>
            <Component {...props} />
        </KodaProvider>
    );

    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Koda Zenith App</title>
        </head>
        <body class="bg-[#0a0a0b] text-white">
            <div id="zenith-root">${html}</div>
            <!-- Hydration logic would go here in a full build pipe -->
        </body>
        </html>
    `;
}

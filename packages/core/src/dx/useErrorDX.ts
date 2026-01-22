import { useState, useEffect } from 'react';
import { useRouteError, isRouteErrorResponse } from 'react-router-dom';

/**
 * @framework/dx
 * Types for the Margin Error DX system.
 */
export interface ErrorSnippet {
    file: string;
    fullPath: string;
    line: number;
    snippet: Array<{ line: number; content: string; isErrorLine: boolean }>;
}

export interface UseErrorDXReturn {
    error: unknown;
    errorName: string;
    errorMessage: string;
    errorStack: string;
    statusCode: number;
    snippet: ErrorSnippet | null;
    copied: boolean;
    handleCopy: () => void;
    openInEditor: () => void;
    showDevTools: boolean;
}

/**
 * Unified Hook for Margin Framework Error DX
 * Centralizes error identification, stack parsing, and dev-only source fetching.
 */
export const useErrorDX = (): UseErrorDXReturn => {
    const error = useRouteError();
    const [copied, setCopied] = useState(false);
    const [snippet, setSnippet] = useState<ErrorSnippet | null>(null);
    const showDevTools = process.env.NODE_ENV !== 'production';

    let statusCode = 500;
    let errorMessage = "Unknown Runtime Error";
    let errorStack = "No stack trace available";
    let errorName = "Error";

    // 1. Identification Logic
    if (isRouteErrorResponse(error)) {
        statusCode = error.status;
        errorMessage = `${error.status} ${error.statusText}`;
        errorName = `HTTP ${error.status}`;
        if (error.status === 404) {
            errorMessage = `Resource not found at: ${window.location.pathname}`;
            errorStack = "Route match failed.";
        }
    } else if (error instanceof Error) {
        errorMessage = error.message;
        errorStack = error.stack || errorStack;
        errorName = error.name;
    } else if (typeof error === 'string') {
        errorMessage = error;
    }

    // 2. Stack Tracing & Snippet Fetching (Dev Only)
    useEffect(() => {
        if (!showDevTools) return;

        const lines = errorStack.split('\n');
        // Find the first frame that belongs to our source code
        const projectFrame = lines.find(l => l.includes('/src/') && l.includes(':'));

        if (projectFrame) {
            const match = projectFrame.match(/\((.*?):(\d+):(\d+)\)/) || projectFrame.match(/at (.*?):(\d+):(\d+)/);
            if (match) {
                const [, file, line] = match;
                const cleanFile = file.split('?')[0];

                fetch(`/api/framework/dx/source?file=${encodeURIComponent(cleanFile)}&line=${line}`)
                    .then(res => res.json())
                    .then(data => {
                        if (data.snippet) setSnippet(data);
                    })
                    .catch(error => {
                        console.error('[MarginDX] Failed to fetch source snippet:', error);
                    });
            }
        }
    }, [errorStack, showDevTools]);

    // 3. Actions
    const handleCopy = () => {
        const textToCopy = isRouteErrorResponse(error)
            ? `Status: ${error.status}\nMessage: ${error.statusText}\nPath: ${window.location.pathname}`
            : `${errorName}: ${errorMessage}\n\n${errorStack}`;

        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const openInEditor = () => {
        if (!snippet) return;
        fetch(`/__open-in-editor?file=${encodeURIComponent(snippet.fullPath)}:${snippet.line}`)
            .catch(error => console.error('[MarginDX] Failed to open in editor:', error));
    };

    return {
        error,
        errorName,
        errorMessage,
        errorStack,
        statusCode,
        snippet,
        copied,
        handleCopy,
        openInEditor,
        showDevTools
    };
};

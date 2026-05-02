"use client";

import DOMPurify from "dompurify";
import { useMemo } from "react";

const HTML_TAG_RE = /<\/?[a-z][\s\S]*?>/i;

export function isLikelyHtml(input: string | null | undefined): boolean {
    if (!input) return false;
    return HTML_TAG_RE.test(input);
}

const SANITIZE_CONFIG = {
    ALLOWED_TAGS: [
        "a", "b", "i", "em", "strong", "u", "s", "br", "p", "span", "div",
        "ul", "ol", "li", "h1", "h2", "h3", "h4", "h5", "h6",
        "blockquote", "pre", "code", "hr", "table", "thead", "tbody", "tr", "th", "td",
    ],
    ALLOWED_ATTR: ["href", "target", "rel"],
    ALLOWED_URI_REGEXP: /^(?:https?|mailto|tel):/i,
    ADD_ATTR: ["target", "rel"],
};

export function sanitizeHtml(input: string): string {
    return DOMPurify.sanitize(input, SANITIZE_CONFIG) as unknown as string;
}

interface RichTextProps {
    content: string | null | undefined;
    className?: string;
}

/**
 * Renders user/AI-supplied text. If it contains HTML, sanitizes and renders it
 * with structural styling; otherwise falls back to plain text with preserved
 * line breaks (whitespace-pre-wrap).
 */
export function RichText({ content, className = "" }: RichTextProps) {
    const value = content ?? "";
    const html = useMemo(() => {
        if (!isLikelyHtml(value)) return null;
        return sanitizeHtml(value);
    }, [value]);

    if (!value) return null;

    if (html !== null) {
        return (
            <div
                className={`rich-text ${className}`.trim()}
                dangerouslySetInnerHTML={{ __html: html }}
            />
        );
    }

    return <p className={`whitespace-pre-wrap ${className}`.trim()}>{value}</p>;
}

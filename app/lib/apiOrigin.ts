/**
 * Builds absolute Laravel URLs for fetch/pdf/etc.
 *
 * Set NEXT_PUBLIC_API_URL to your API root **including** `/api`, e.g.:
 *   https://api.offerra.click/api
 *   https://offerra.click/api
 *
 * Strips trailing `/api` segments from the path so values like `.../api/api`
 * (misconfigured) still resolve to `${origin}/api/...` correctly.
 */
export function getBackendOrigin(): string {
    const raw = (process.env.NEXT_PUBLIC_API_URL || "").trim();
    if (!raw) return "";

    try {
        const normalized = raw.replace(/\/+$/, "");
        const url = new URL(normalized);

        let path = url.pathname.replace(/\/+$/, "") || "";

        while (path.endsWith("/api")) {
            path = path.slice(0, -4).replace(/\/+$/, "") || "";
        }

        url.pathname = path;
        const suffix = path ? path : "";
        return `${url.origin}${suffix}`;
    } catch {
        return "";
    }
}

/** Absolute URL for a path starting at the Laravel `/api` prefix, e.g. `/api/u/alice` */
export function apiAbsoluteUrl(apiPath: string): string {
    const origin = getBackendOrigin();
    const p = apiPath.startsWith("/") ? apiPath : `/${apiPath}`;
    return `${origin}${p}`;
}

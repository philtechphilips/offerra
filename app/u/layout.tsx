/**
 * Ensure `/u/[username]` is always handled dynamically (public profiles must not
 * fall through to a stale static shell on hosts that optimize aggressively).
 */
export const dynamic = "force-dynamic";

export default function PublicProfilesLayout({ children }: { children: React.ReactNode }) {
    return children;
}

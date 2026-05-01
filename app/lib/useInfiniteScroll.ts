"use client";

import { useEffect, useRef } from "react";

interface UseInfiniteScrollOptions {
    hasMore: boolean;
    isLoading: boolean;
    onLoadMore: () => void;
    rootMargin?: string;
}

export function useInfiniteScroll({
    hasMore,
    isLoading,
    onLoadMore,
    rootMargin = "200px",
}: UseInfiniteScrollOptions) {
    const sentinelRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const node = sentinelRef.current;
        if (!node || !hasMore) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const first = entries[0];
                if (!first?.isIntersecting) return;
                if (isLoading) return;
                onLoadMore();
            },
            { root: null, rootMargin, threshold: 0.1 }
        );

        observer.observe(node);
        return () => observer.disconnect();
    }, [hasMore, isLoading, onLoadMore, rootMargin]);

    return { sentinelRef };
}

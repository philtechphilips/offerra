export interface PaginationMeta {
    current_page: number;
    last_page: number;
    total: number;
}

export function clampPage(page: number, lastPage: number): number {
    if (lastPage < 1) return 1;
    return Math.min(Math.max(page, 1), lastPage);
}

export function getPaginationLabel(meta: PaginationMeta, itemLabel: string): string {
    const safeItemLabel = itemLabel.trim() || "items";
    return `Page ${meta.current_page} of ${meta.last_page} (${meta.total} ${safeItemLabel})`;
}

export interface PaginationQuery {
    page?: string | number;
    pageSize?: string | number;
    [key: string]: any;
}
export interface PaginatedResult<T> {
    items: T[];
    total: number;
}
export declare function paginateQuery<T>(prisma: any, model: string, query: PaginationQuery, options?: {
    where?: any;
    orderBy?: any;
    include?: any;
    select?: any;
}): Promise<PaginatedResult<T>>;

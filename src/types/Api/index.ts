export interface ApiResponse<T extends object | any[]> {
    code: number;
    data: T;
    message: string;
}

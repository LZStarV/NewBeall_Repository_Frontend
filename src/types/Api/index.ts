export interface ApiResponse<T extends object | any[]> {
  code: number | string;
  data: T;
  message: string;
}

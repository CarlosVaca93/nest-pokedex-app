export interface HttpAdapter {
    get<T>(url: string): Promise<T>;
    post<T>(url: string, payload: any): Promise<T>;
    patch<T>(url: string, payload: any): Promise<T>;
    delete<T>(url: string): Promise<T>;
}

export interface admin{
    id: number,
    name: string,
    email: string
}
export interface getAllAdminsResponse{
    data?: admin[],
    status: number
}
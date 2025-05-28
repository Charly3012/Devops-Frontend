export interface invitationCode{
    id: number,
    code: string,
    used_status: boolean,
    created_at: Date,
    expires_at: Date,
}

interface invitationCodeResponse {
    id: number,
    code: string,
    used_status: boolean,
    created_at: Date,
    expires_at: Date,
    crated_at: Date, 
    updated_at: Date 
}
export interface invitationCodeListResponse {
    message: string,
    data?: invitationCodeResponse[],
    status: number
}
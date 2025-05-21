export interface registerRequest {
  name: string,
  email: string,
  password: string,
  invitation_code: string
}


export interface registerReponse{
  id: number,
  name: string,
  email: string
}

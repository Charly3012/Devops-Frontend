export interface registerRequest {
  name: string,
  email: string,
  password: string,
  invitation_code: string
}


export interface registerReponse{
  data: dataRegister,
  status: number
}

interface dataRegister{
  id: number,
  name: string,
  email: string
}

export interface User {
  id: string
  email: string
  name: string | null
}

export interface Session {
  user: User
  expires: string
}

export interface AuthCredentials {
  email: string
  password: string
}

export interface RegisterCredentials extends AuthCredentials {
  name?: string
}

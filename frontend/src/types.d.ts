export interface IUser {
  _id: string;
  username: string;
  token: string;
  role: string;
  displayName: string;
  googleID?: string;
  avatar: string | null;
}

export interface RegisterResponse {
  user: IUser;
  message: string;
}

export interface RegisterMutation {
  username: string;
  password: string;
  displayName: string;
  avatar: File | null;
}

export interface LoginMutation {
  username: string;
  password: string;
}

export interface ValidationError {
  errors: {
    [key: string]: {
      name: string;
      message: string;
    }
  },
  message: string;
  name: string;
  _message: string;
}

export interface GlobalError {
  error: string;
}

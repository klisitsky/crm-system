import type { AuthData, Profile, Token, UserRegistration } from "@/types/auth";
import { instance } from "./instanceApi";

export const authApi = {
  login: async (requestBody: AuthData) => {
    return instance.post<Token>("/auth/signin", requestBody).then(res => res.data);
  },
  signUp: async (requestBody: UserRegistration) => {
    return instance.post<Profile>("/auth/signup", requestBody).then(res => res.data);
  }
};
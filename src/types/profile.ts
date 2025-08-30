import type { Role } from "./common";

export interface Profile {
  id: number;
  username: string;
  email: string;
  date: string;
  isBlocked: boolean;
  roles: Role[];
  phoneNumber: string;
}

export interface ProfileRequest {
  username: string;
  email: string;
  phoneNumber: string;
}
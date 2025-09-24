export interface UserFilters {
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  isBlocked?: boolean;
  limit?: number;
  page?: number; 
}

export interface User {
  id: number;
  username: string;
  email: string;
  date: string;
  isBlocked: boolean;
  roles: Roles[];
  phoneNumber: string;
}

export interface UsersMetaInfo {
  totalAmount: number;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

export interface MetaResponse<T> {
  data: T[];
  meta: UsersMetaInfo;
}

export interface UserRolesRequest {
  roles: Roles[];
}

export interface UserRequest {
  username?: string;
  email?: string;
  phoneNumber?: string;
}

export enum Roles {
  ADMIN = "ADMIN",
  MODERATOR = "MODERATOR",
  USER = "USER",
}

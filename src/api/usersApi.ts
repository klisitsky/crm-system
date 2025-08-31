import { instance } from "./instanceApi";
import type { MetaResponse, User, UserFilters, UserRequest, UserRolesRequest } from "@/types/users";

export const usersApi = {
  fetchUsers: async (userFilters?: UserFilters) => {
    return instance
      .get<MetaResponse<User>>("/admin/users", { params: userFilters })
      .then((res) => res.data);
  },
  updateUserData: async (id: number, userRequestBody: UserRequest) => {
    return instance.put<User>(`/admin/users/${id}`, userRequestBody).then((res) => res.data);
  },
  deleteUser: async (id: number) => {
    return instance.delete<User>(`/admin/users/${id}`).then((res) => res.data);
  },
  blockUser: async (id: number) => {
    return instance.post<User>(`/admin/users/${id}/block`).then((res) => res.data);
  },
  unblockUser: async (id: number) => {
    return instance.post<User>(`/admin/users/${id}/unblock`).then((res) => res.data);
  },
  updateUserRights: async (id: number, params: UserRolesRequest) => {
    return instance.post<User>(`/admin/users/${id}/rights`, params).then((res) => res.data);
  },
};

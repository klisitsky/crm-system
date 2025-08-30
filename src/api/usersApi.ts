import type { MetaResponse, User, UserFilters } from "@/types/users";
import { instance } from "./instanceApi";

export const usersApi = {
  fetchUsers: async (userFilters?: UserFilters) => {
    return instance
      .get<MetaResponse<User>>("/admin/users", { params: userFilters })
      .then((res) => res.data);
  },
};

import { instance } from "./instanceApi";
import type { Profile } from "@/types/profile";

export const profileApi = {
  fetchProfile: async () => {
    return instance.get<Profile>("/user/profile").then(res => res.data);
  },
};
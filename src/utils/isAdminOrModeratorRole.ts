import type { Role } from "@/types/profile"

export const isAdminOrModeratorRole = (roles: Role[] | undefined): boolean => {
  if (roles) {
    return roles.includes("ADMIN") || roles.includes("MODERATOR")
  } else {
    return false;
  }
}
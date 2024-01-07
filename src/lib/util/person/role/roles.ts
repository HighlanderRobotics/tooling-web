import { Role } from "@prisma/client";

export const roles = [
    "STUDENT",
    "MENTOR",
    "OTHER",
]

export const prismaRoles: Record<string, Role> = {
    "STUDENT": Role.STUDENT,
    "MENTOR": Role.MENTOR,
    "OTHER": Role.OTHER,
}

export type RoleString = typeof roles[number];

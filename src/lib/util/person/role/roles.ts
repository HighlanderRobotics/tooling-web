export const roles = [
    "STUDENT",
    "MENTOR",
    "SUPERVISOR",
    "OTHER",
] as const;

export type RoleString = typeof roles[number];

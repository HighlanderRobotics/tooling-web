import { Role } from "@prisma/client";


export const prismaRoles: Record<string, Role> = {
    "STUDENT": Role.STUDENT,
    "MENTOR": Role.MENTOR,
    "SUPERVISOR": Role.SUPERVISOR,
    "OTHER": Role.OTHER,
};

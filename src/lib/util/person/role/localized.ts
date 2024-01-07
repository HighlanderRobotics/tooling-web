import type { RoleString } from "./roles";

export const localizedRole = (role: RoleString) =>
	({
		STUDENT: 'Student',
		MENTOR: 'Mentor',
		OTHER: 'Other',
	}[role] ?? role);

import type { RoleString } from "./roles";

export const localizedRole = (role: RoleString) =>
	({
		STUDENT: 'Student',
		MENTOR: 'Mentor',
		SUPERVISOR: 'Supervisor',
		OTHER: 'Other',
	}[role] ?? role);

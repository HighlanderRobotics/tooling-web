import type { RoleString } from "./roles";

export const localizedRole = (role: RoleString) =>
	({
		student: 'Student',
		mentor: 'Mentor',
		other: 'Other',
	}[role] ?? role);

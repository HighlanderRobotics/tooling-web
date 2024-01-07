import type { Role } from "./roles";

export const localizedRole = (role: Role) =>
	({
		student: 'Student',
		mentor: 'Mentor',
		other: 'Other',
	}[role] ?? role);

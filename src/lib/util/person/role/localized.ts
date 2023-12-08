export const localizedRole = (role: string) =>
	({
		student: 'Student',
		mentor: 'Mentor'
	}[role] ?? role);

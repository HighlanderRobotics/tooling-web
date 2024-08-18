import { hasPermission } from '$lib/server/util/permission/hasPermission';
import { getPersonFromUser } from '$lib/server/util/person/getPersonFromUser';
import { error } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	const session = await locals.getSession();
	if (!session?.user) throw error(500);

	const person = await getPersonFromUser(session.user);
	if (!person) throw error(500);

	if (!(await hasPermission(person, 'attendance.view'))) {
		throw error(403, 'You do not have permission to view attendance');
	}
};

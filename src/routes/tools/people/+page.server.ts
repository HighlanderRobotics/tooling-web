import { hasPermission } from '$lib/server/util/permission/hasPermission';
import { getPersonFromUser } from '$lib/server/util/person/getPersonFromUser';
import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getAllPeople } from '$lib/server/util/person/getAllPeople';
import { Prisma, type Person } from '@prisma/client';
import { addPerson } from '$lib/server/util/person/addPerson';
import { roles, type RoleString } from '$lib/util/person/role/roles';

export const load = (async (event) => {
	const session = await event.locals.getSession();
	if (!session?.user) throw error(500);

	const person = await getPersonFromUser(session?.user);
	if (!person) throw error(500);

	const permissions = {
		view: await hasPermission(person, 'people.view'),
		edit: await hasPermission(person, 'people.edit')
	};

	const output: {
		permissions: {
			view: boolean;
			edit: boolean;
		};
		people?: Person[];
	} = { permissions };

	if (!permissions.view) {
		throw error(403, 'You do not have permission to view people.');
	} else {
		output['people'] = await getAllPeople();
	}

	return output;
}) satisfies PageServerLoad;

export const actions = {
	addPerson: async ({ request, locals }) => {
		const session = await locals.getSession();

		if (!session || !session?.user) {
			throw error(403, 'Not logged in');
		}

		const person = await getPersonFromUser(session.user);

		if (!person) {
			throw error(403, 'Account not recognized');
		}

		if (!(await hasPermission(person, 'people.edit'))) {
			throw error(403, 'User is not authorized');
		}

		const data = await request.formData();

		const name = data.get('name');
		const email = data.get('email');
		const role = data.get('role');
		const teamAffiliated = data.get('teamAffiliated') == 'on';

		if (!name) throw error(400, 'Missing "name" field.');
		if (!email) throw error(400, 'Missing "email" field.');
		if (!role) throw error(400, 'Missing "role" field.');
		if (!roles.includes(role.toString())) throw error(400, 'Invalid "role" field');

		try {
			await addPerson(name.toString(), email.toString(), role as RoleString, teamAffiliated);
		} catch (e) {
			if (e instanceof Prisma.PrismaClientKnownRequestError && e.code == 'P2002') {
				return fail(400, { field: 'email', message: 'Email already used.', error: true });
			} else {
				throw e;
			}
		}
	}
};

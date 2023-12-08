import { hasPermission } from '$lib/server/util/permission/hasPermission';
import { getPersonById } from '$lib/server/util/person/getPersonById';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getPersonFromUser } from '$lib/server/util/person/getPersonFromUser';
import type { Person, Prisma } from '@prisma/client';
import prisma from '$lib/server/util/prisma';

export const load: PageServerLoad = async ({ params, locals }) => {
	const session = await locals.getSession();
	if (!session?.user) throw error(500);

	const requester = await getPersonFromUser(session?.user);
	if (!requester) throw error(500);

	const permissions = {
		people: {
			view: await hasPermission(requester, 'people.view'),
			edit: await hasPermission(requester, 'people.edit'),
		},
		labCertification: {
			view: await hasPermission(requester, 'labcertification.view'),
			edit: await hasPermission(requester, 'labcertification.edit'),
		},
	};

	if (!permissions.people.view) {
		throw error(403, 'You do not have permission to view people.');
	}

	const person = await prisma.person.findUnique({
		where: {
			id: params.id,
		},
		select: {
			id: true,
			name: true,
			role: true,
			email: true,
			teamAffiliated: true,
			labCertification: permissions.labCertification.view,
		}
	}) as Prisma.PersonGetPayload<{
		select: {
			id: true;
			name: true;
			role: true;
			email: true;
            teamAffiliated: true;
			labCertification: boolean;
		};
	}>;

	if (!person) throw error(404, 'Person not found');

	return {
		permissions,
		person
	};
};

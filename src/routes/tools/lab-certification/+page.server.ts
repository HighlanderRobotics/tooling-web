import { hasPermission } from '$lib/server/util/permission/hasPermission';
import { getPersonFromUser } from '$lib/server/util/person/getPersonFromUser';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import prisma from '$lib/server/util/prisma';
import type { Prisma } from '@prisma/client';
import { certificationAction } from '../../../lib/server/util/lab-certification/certificationAction';

export const load = (async (event) => {
	const session = await event.locals.getSession();
	if (!session?.user) throw error(500);

	const person = await getPersonFromUser(session?.user);
	if (!person) throw error(500);

	const permissions = {
		view: await hasPermission(person, 'labcertification.view'),
		edit: await hasPermission(person, 'labcertification.edit')
	};

	if (!permissions.view) throw error(403, 'You do not have permission to view lab certification.');

	return {
		permissions,
		people: (await prisma.person.findMany({
			select: {
				id: true,
				name: true,
				role: true,
				email: false,
				permissions: false,
				labCertification: true
			}
		})) as Prisma.PersonGetPayload<{
			select: {
				id: true;
				name: true;
				role: true;
				email: false;
				permissions: false;
				labCertification: true;
			};
		}>[]
	};
}) satisfies PageServerLoad;

export const actions = {
	certify: async (event) => await certificationAction(true, event),
	unCertify: async (event) => await certificationAction(false, event)
};

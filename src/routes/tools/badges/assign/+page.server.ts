import { hasPermission } from '$lib/server/util/permission/hasPermission';
import { getPersonFromUser } from '$lib/server/util/person/getPersonFromUser';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import prisma from '$lib/server/util/prisma';

export const load = (async (event) => {
	const session = await event.locals.getSession();
	if (!session?.user) throw error(500);

	const person = await getPersonFromUser(session?.user);
	if (!person) throw error(500);

	const permissions = {
		view: await hasPermission(person, 'badges.view'),
		edit: await hasPermission(person, 'badges.edit')
	};

	if (!permissions.view) {
		throw error(403, 'You do not have permission to view badges.');
	}

	// get the payload from the query params
	const payload = event.url.searchParams.get('payload');

	if (!payload) {
		throw error(400, 'No payload provided');
	}

	const output: {
		permissions: {
			view: boolean;
			edit: boolean;
		};
		payload: string;
	} = { permissions, payload };

	return output;
}) satisfies PageServerLoad;

export const actions = {
	assign: async ({ request, locals }) => {
		const session = await locals.getSession();
		if (!session?.user) throw error(500);

		const person = await getPersonFromUser(session?.user);
		if (!person) throw error(500);

		const canEdit = await hasPermission(person, 'badges.edit');

		if (!canEdit) {
			throw error(403, 'You do not have permission to edit badges.');
		}

		const formData = await request.formData();

		const payload = formData.get('payload');
		console.log(payload);

		if (!payload) {
			console.log('no payload');
			throw error(400, 'No payload provided');
		}

		const personId = formData.get('person');

		if (!personId) {
			throw error(400, 'No person provided');
		}

		await prisma.badge.upsert({
			where: {
				payload: payload.toString()
			},
			update: {
				ownerId: personId.toString()
			},
			create: {
				payload: payload.toString(),
				ownerId: personId.toString()
			}
		});

		throw redirect(303, `/tools/badges/assign/success`);
	}
};

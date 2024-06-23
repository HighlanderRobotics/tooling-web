import { hasPermission } from '$lib/server/util/permission/hasPermission';
import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getPersonFromUser } from '$lib/server/util/person/getPersonFromUser';
import type { Prisma } from '@prisma/client';
import prisma from '$lib/server/util/prisma';
import * as z from 'zod';
import { roles } from '$lib/util/person/role/roles';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { put } from '@vercel/blob';
import sharp from 'sharp';

export const load: PageServerLoad = async ({ params, locals }) => {
	const session = await locals.getSession();
	if (!session?.user) throw error(500);

	const requester = await getPersonFromUser(session?.user);
	if (!requester) throw error(500);

	const permissions = {
		people: {
			view: await hasPermission(requester, 'people.view'),
			edit: await hasPermission(requester, 'people.edit')
		},
		labCertification: {
			view: await hasPermission(requester, 'labcertification.view'),
			edit: await hasPermission(requester, 'labcertification.edit')
		}
	};

	if (!permissions.people.view) {
		throw error(403, 'You do not have permission to view people.');
	}

	const person = (await prisma.person.findUnique({
		where: {
			id: params.id
		},
		select: {
			id: true,
			name: true,
			role: true,
			email: true,
			teamAffiliated: true,
			labCertification: permissions.labCertification.view
		}
	})) as Prisma.PersonGetPayload<{
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

export const actions = {
	edit: async (event) => {
		const session = await event.locals.getSession();
		if (!session?.user) throw error(500);

		const requester = await getPersonFromUser(session?.user);
		if (!requester) throw error(500);

		const canEdit = await hasPermission(requester, 'people.edit');

		if (!canEdit) {
			throw error(403, 'You do not have permission to edit people.');
		}

		const formData = await event.request.formData();

		// Validate data
		const schema = z.object({
			name: z.string().min(1),
			role: z.enum(roles),
			email: z.string().email(),
			teamAffiliated: z
				.enum(['on', 'off'])
				.optional()
				.transform((value) => value === 'on')
		});

		try {
			const data = schema.parse(Object.fromEntries(formData));

			await prisma.person.update({
				where: {
					id: event.params.id
				},
				data
			});
		} catch (e) {
			console.error(e);

			if (e instanceof z.ZodError) {
				const sentError = e.errors[0];

				return fail(400, {
					message: sentError.message
				});
			}

			if (e instanceof PrismaClientKnownRequestError) {
				return fail(400, {
					message: 'An error occured. Check if the email is already used.'
				});
			}

			throw error(500);
		}
	},
	uploadImage: async ({ request, locals, params }) => {
		const session = await locals.getSession();

		if (!session?.user) throw error(500);

		const requester = await getPersonFromUser(session?.user);
		if (!requester) throw error(500);

		const canEdit = await hasPermission(requester, 'people.edit');

		if (!canEdit) {
			throw error(403, 'You do not have permission to edit people.');
		}

		const formData = await request.formData();
		const image = formData.get('image') as File;

		if (!image) {
			throw error(400, { message: 'No file to upload.' });
		}

		if (image.type !== 'image/jpeg') {
			return fail(400, { message: 'Must be a JPEG' });
		}

		if (image.size >= 1000000) {
			return fail(400, { message: 'Must be smaller than 1 MB' });
		}

		const metadata = await sharp(await image.arrayBuffer()).metadata();

		if (metadata.width !== 500 || metadata.height !== 500) {
			return fail(400, { message: 'Must be exactly 500 by 500 pixels' });
		}

		const { url } = await put(`profile-image-${params.id}.jpg`, image, { access: 'public' });

		console.log(url);

		return { uploaded: url };
	}
};

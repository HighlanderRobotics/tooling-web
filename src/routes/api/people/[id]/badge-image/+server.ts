import { hasPermission } from '$lib/server/util/permission/hasPermission';
import { getPersonFromUser } from '$lib/server/util/person/getPersonFromUser';
import prisma from '$lib/server/util/prisma';
import { error, type RequestHandler } from '@sveltejs/kit';
import heeboRegularUrl from '$lib/assets/fonts/Heebo-Regular.ttf';
import heeboBoldUrl from '$lib/assets/fonts/Heebo-Bold.ttf';
import { image_from_component } from 'svelte-component-to-image';
import Badge from '$lib/components/Badge.svelte';
import { localizedRole } from '$lib/util/person/role/localized';

export const GET: RequestHandler = async ({ params, locals, fetch }) => {
	const session = await locals.getSession();

	if (!session || !session.user) {
		throw error(401);
	}

	const person = await getPersonFromUser(session.user);

	if (!person) {
		throw error(403, 'Account not recognized');
	}

	if (!(await hasPermission(person, 'people.view'))) {
		throw error(403, 'User is not authorized');
	}

	const badgeOwner = await prisma.person.findUniqueOrThrow({
		where: {
			id: params.id
		}
	});

	if (!person) {
		throw error(404, 'Person not found');
	}

	const IMAGE_SCALE = 6;

	const imageResponse = await fetch(`/api/people/${params.id}/picture?size=250`);
	if (!imageResponse.ok) {
		throw error(500);
	}
	// Get a base64 encoded data URL
	const imageBuffer = await imageResponse.arrayBuffer();
	const profileImageUrl = `data:image/png;base64,${Buffer.from(imageBuffer).toString('base64')}`;

	console.log(profileImageUrl);

	const image = await image_from_component(Badge, {
		width: 153.36 * IMAGE_SCALE,
		height: 241.2 * IMAGE_SCALE,
		fonts: [
			{
				name: 'Heebo',
				url: heeboRegularUrl,
				weight: 400
			},
			{
				name: 'Heebo',
				url: heeboBoldUrl,
				weight: 700
			}
		],
		props: {
			name: badgeOwner.name,
			position: localizedRole(badgeOwner.role), // TODO: Make these editable
			school: 'School',
			graduationYear: 2026,
			imageUrl: profileImageUrl
		}
	});

	return new Response(image, { headers: { 'Content-Type': 'image/png' } });
};

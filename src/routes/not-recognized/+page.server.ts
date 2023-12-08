import { getPersonByEmail } from '$lib/server/util/person/getPersonByEmail';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async (event) => {
	const session = await event.locals.getSession();

	// If the user has an associated person, redirect to /
	if (await getPersonByEmail(session?.user?.email as string)) {
		throw redirect(302, '/');
	}
}) satisfies PageServerLoad;

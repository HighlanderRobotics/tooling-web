import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { getPersonFromUser } from '$lib/server/util/person/getPersonFromUser';

export const load: LayoutServerLoad = async (event) => {
	const session = await event.locals.getSession();

	// Check if the user is logged in but not recognized as a person
	if (session?.user) {
		// Check if a person matching the email exists in the database
		const person = await getPersonFromUser(session?.user);

		// If not, redirect to /not-recognized (unless already there)
		if (!person && event.url.pathname !== '/not-recognized') {
			throw redirect(302, '/not-recognized');
		}
	} else {
		// If not logged in, redirect to / (unless already there)
		if (event.url.pathname !== '/') {
			throw redirect(302, '/');
		}
	}

	return {
		session: session
	};
};

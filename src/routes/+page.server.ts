import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async (event) => {
    // Redirect to /tools if the user is logged in
    const session = await event.locals.getSession();

    if (session) {
        throw redirect(302, '/tools');
    }

    return {

    };
}) satisfies PageServerLoad;
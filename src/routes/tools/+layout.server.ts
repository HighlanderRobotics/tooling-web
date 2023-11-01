import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
    // Redirect to / if the user is not logged in, and include the current path as a query parameter
    const session = await event.locals.getSession();

    if (!session) {
        throw redirect(302, '/');
    }
};

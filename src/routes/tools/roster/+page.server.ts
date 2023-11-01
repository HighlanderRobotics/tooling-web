import { hasPermission } from '$lib/server/util/permission/hasPermission';
import { getPersonFromUser } from '$lib/server/util/person/getPersonFromUser';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getAllPeople } from '$lib/server/util/person/getAllPeople';
import type { Person } from '@prisma/client';

export const load = (async (event) => {
    const session = await event.locals.getSession();
    if (!session?.user) throw error(500);

    const person = await getPersonFromUser(session?.user);
    if (!person) throw error(500);

    const permissions = {
        view: await hasPermission(person, 'roster.view'),
        edit: await hasPermission(person, 'roster.edit'),
    };

    const output: {
        permissions: {
            view: boolean;
            edit: boolean;
        };
        people?: Person[];
    } = { permissions };

    if (!permissions.view) {
        throw error(403, 'You do not have permission to view the roster.')
    } else {
        output['people'] = await getAllPeople();
    }

    return output;
}) satisfies PageServerLoad;
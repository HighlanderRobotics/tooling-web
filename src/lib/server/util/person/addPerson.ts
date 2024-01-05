import type { Role } from '$lib/util/person/role/roles';
import { defaultPermissions } from '../permission/defaultPermissions';
import prisma from '../prisma';

export async function addPerson(name: string, email: string, role: Role, teamAffiliated: boolean) {
	const person = await prisma.person.create({ data: { name, email, role, teamAffiliated } });

	await prisma.permission.createMany({
		data: defaultPermissions.map((permission) => ({
			personId: person.id,
			path: permission,
		}))
	});

	return person;
}

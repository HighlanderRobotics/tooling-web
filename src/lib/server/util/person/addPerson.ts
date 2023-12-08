import type { Role } from '$lib/util/person/role/roles';
import prisma from '../prisma';

export async function addPerson(name: string, email: string, role: Role, teamAffiliated: boolean) {
	return await prisma.person.create({ data: { name, email, role, teamAffiliated } });
}

import prisma from '../prisma';

/**
 * Get a person by their ID
 */

export async function getPersonById(id: string) {
	return await prisma.person.findUnique({
		where: {
			id: id
		}
	});
}

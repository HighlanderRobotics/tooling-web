import prisma from '../prisma';

/**
 * Get all people
 */
export async function getAllPeople() {
	return await prisma.person.findMany({
		orderBy: {
			name: 'asc'
		}
	});
}

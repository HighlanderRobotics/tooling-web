import prisma from '../prisma';

/**
 * Get a person by their email address
 */

export async function getPersonByEmail(email: string) {
	return await prisma.person.findUnique({
		where: {
			email: email
		}
	});
}

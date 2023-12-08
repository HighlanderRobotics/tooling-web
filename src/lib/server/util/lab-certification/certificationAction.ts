import { hasPermission } from '$lib/server/util/permission/hasPermission';
import { getPersonFromUser } from '$lib/server/util/person/getPersonFromUser';
import { error, type RequestEvent } from '@sveltejs/kit';
import prisma from '$lib/server/util/prisma';

export const validCertifications = ['safetyQuiz', 'emergencyPreparedness', 'labLayout'];

export async function certificationAction(
	certifies: boolean,
	event: RequestEvent<any, string>
) {
	const { locals, url } = event;

	console.log("certify");

	const session = await locals.getSession();
	if (!session || !session?.user) {
		throw error(403, 'Not logged in');
	}

	const editingPerson = await getPersonFromUser(session.user);

	if (!editingPerson) {
		throw error(403, 'Account not recognized');
	}

	if (!(await hasPermission(editingPerson, 'labcertification.edit'))) {
		throw error(403, 'User is not authorized');
	}

	const targetPersonId = url.searchParams.get('person');
	const certification = url.searchParams.get('certification');

	if (!targetPersonId) {
		throw error(400, 'Missing person id');
	}

	if (!certification) {
		throw error(400, 'Missing certification');
	}

	if (!validCertifications.includes(certification)) {
		throw error(400, 'Invalid certification');
	}

	// Certify the person
	await prisma.person.update({
		where: {
			id: targetPersonId
		},
		include: {
			labCertification: true
		},
		data: {
			labCertification: {
				upsert: {
					create: {
						[certification]: certifies
					},
					update: {
						[certification]: certifies
					}
				}
			}
		}
	});
}

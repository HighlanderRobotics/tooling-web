import type { Person } from '@prisma/client';
import prisma from '../prisma';

/**
 * Check if a person has a permission
 */

export async function hasPermission(person: Person, permission: string) {
	// Make a list of applicable permissions
	const applicablePermissions = [permission];

	for (let i = 0; i < permission.split('.').length; i++) {
		let thisPermission = '';

		for (let j = 0; j < i; j++) {
			thisPermission += permission.split('.')[j] + '.';
		}

		thisPermission += '*';

		applicablePermissions.push(thisPermission);
	}

	// Check if the person has any of the applicable permissions
	const allowingPermission = await prisma.permission.findFirst({
		where: {
			personId: person.id,
			path: {
				in: applicablePermissions
			}
		}
	});

	return !!allowingPermission;
}

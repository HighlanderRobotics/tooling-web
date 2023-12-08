import { localizedPermissions } from './localizedPermissions';

/**
 * Get a localized permission
 */

export function getLocalizedPermission(permission: string) {
	const permissionParts = permission.split('.');

	if (permissionParts[0] == 'permission') {
		permissionParts.shift();
		return `Allow others to ${permissionParts.join('.')}`;
	}

	for (let i = 0; i < permissionParts.length; i++) {
		// First i parts of the LocalizedPermissionTree
		let deepestNode = localizedPermissions[permissionParts[0]];

		for (let j = 1; j < permissionParts.length; j++) {
			console.log(deepestNode);

			// If it's a LocalizedPermissionTree, go deeper
			if (typeof deepestNode === 'object') {
				deepestNode = deepestNode[permissionParts[j]];
			}
		}

		if (typeof deepestNode === 'string') {
			// If it's a string, return it.
			const string = deepestNode;
			return string;
		} else {
			return permission;
		}
	}
}

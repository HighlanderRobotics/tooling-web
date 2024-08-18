export type LocalizedPermissionTree = {
	[key: string]: string | LocalizedPermissionTree;
};

export const localizedPermissions: LocalizedPermissionTree = {
	'*': 'Do absolutely anything',
	people: {
		'*': 'Full access to people',
		view: 'View people',
		edit: 'Edit people'
	},
	labcertification: {
		'*': 'Full access to lab certification',
		view: 'View lab certification',
		edit: 'Edit lab certification',
		self: {
			'*': "Full access to one's own lab certification",
			view: "View one's own lab certification",
			edit: "Edit one's own lab certification"
		}
	},
	attendance: {
		'*': 'Full access to attendance',
		view: 'View attendance',
		edit: 'Edit attendance'
	}
};

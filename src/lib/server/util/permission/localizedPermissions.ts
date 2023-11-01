export type LocalizedPermissionTree = {
    [key: string]: string | LocalizedPermissionTree;
}

export const localizedPermissions: LocalizedPermissionTree = {
    '*': 'Do absolutely anything',
    'roster': {
        '*': 'Full access to roster',
        'view': 'View roster',
        'edit': 'Edit roster',
    },
};

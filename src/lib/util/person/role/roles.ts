export const roles = ['student', 'mentor', 'other'] as const;

export type Role = typeof roles[number];

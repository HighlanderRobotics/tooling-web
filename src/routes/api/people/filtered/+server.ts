import type { RequestHandler } from './$types';
import prisma from '$lib/server/util/prisma';

const getFilteredPeople = async (search: string) => {
	const people = await prisma.person.findMany({
		select: {
			id: true,
			name: true
		},
		where: {
			AND: {
				OR: [
					{
						name: {
							contains: search,
							mode: 'insensitive'
						}
					},
					{
						email: {
							contains: search,
							mode: 'insensitive'
						}
					}
				]
			}
		},
		take: 10
	});

	return people;
};

export const GET: RequestHandler = async ({ url }) => {
	const { searchParams } = new URL(url);
	const search = searchParams.get('search') ?? '';

	const people = await getFilteredPeople(search);

	return new Response(JSON.stringify(people), {
		headers: {
			'Content-Type': 'application/json'
		}
	});
};

export type FilteredPerson = Awaited<ReturnType<typeof getFilteredPeople>>[number];

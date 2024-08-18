import type { RequestHandler } from './$types';
import prisma from '$lib/server/util/prisma';
import { DateTime } from 'luxon';
import { error } from '@sveltejs/kit';

const getFilteredPeople = async (search: string, noAttendanceOnDay: DateTime | null) => {
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
				],
				attendanceLogEntries: noAttendanceOnDay
					? {
							none: {
								timestamp: {
									lte: noAttendanceOnDay.endOf('day').toJSDate(),
									gte: noAttendanceOnDay.startOf('day').toJSDate()
								}
							}
					  }
					: undefined
			}
		},
		take: 10
	});

	return people;
};

export const GET: RequestHandler = async ({ url }) => {
	const { searchParams } = new URL(url);
	const search = searchParams.get('search') ?? '';
	const noAttendanceOnDayString = searchParams.get('noAttendanceOnDay');

	let noAttendanceOnDay: DateTime | null = null;

	if (noAttendanceOnDayString) {
		noAttendanceOnDay = DateTime.fromFormat(noAttendanceOnDayString, 'yyyy-MM-dd');
		if (!noAttendanceOnDay.isValid) {
			throw error(400, 'Invalid date');
		}
	}

	const people = await getFilteredPeople(search, noAttendanceOnDay);

	return new Response(JSON.stringify(people), {
		headers: {
			'Content-Type': 'application/json'
		}
	});
};

export type FilteredPerson = Awaited<ReturnType<typeof getFilteredPeople>>[number];

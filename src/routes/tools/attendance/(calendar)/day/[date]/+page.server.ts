import { getPersonFromUser } from '$lib/server/util/person/getPersonFromUser.js';
import prisma from '$lib/server/util/prisma.js';
import { AttendanceLogEntrySource } from '@prisma/client';
import { error } from '@sveltejs/kit';
import { DateTime } from 'luxon';
import { DailyAttendanceEntry } from './dailyAttendanceEntrySchema';
import { hasPermission } from '$lib/server/util/permission/hasPermission';

export const load = async ({ params }) => {
	const date = DateTime.fromFormat(params.date, 'yyyy-MM-dd');

	const entries = await prisma.attendanceLogEntry.findMany({
		where: {
			timestamp: {
				gte: date.startOf('day').toJSDate().toISOString(),
				lte: date.endOf('day').toJSDate().toISOString()
			}
		},
		select: {
			id: true,
			timestamp: true,
			personId: true,
			enteredBy: {
				select: {
					name: true
				}
			},
			person: {
				select: {
					name: true,
					id: true
				}
			},
			source: true,
			includeTime: true
		},
		orderBy: {
			timestamp: 'asc'
		}
	});

	const formatSource = (entry: (typeof entries)[number]) => {
		if (entry.source === 'DASHBOARD') {
			if (entry.enteredBy !== null) {
				return `Recorded by ${entry.enteredBy.name}`;
			} else {
				return 'Recorded manually';
			}
		} else if (entry.source === 'KIOSK') {
			if (entry.includeTime) {
				return `Checked in at ${DateTime.fromJSDate(entry.timestamp).toFormat('h:mm a')}`;
			} else {
				return `Checked in at kiosk`;
			}
		}

		return 'Unknown source';
	};

	const attendanceLogEntries = entries.map((entry) => ({
		id: entry.id,
		timestamp: entry.timestamp.toISOString(),
		source: formatSource(entry),
		person: entry.person,
		enteredBy: entry.enteredBy
	})) satisfies DailyAttendanceEntry[];

	return {
		date: date.toFormat('yyyy-MM-dd'),
		attendanceLogEntries
	};
};

export const actions = {
	addAttendance: async (event) => {
		const session = await event.locals.getSession();
		if (!session?.user) throw error(500);

		const personAdding = await getPersonFromUser(session.user);
		if (!personAdding) throw error(500);

		if (!(await hasPermission(personAdding, 'attendance.edit'))) {
			throw error(403, 'You do not have permission to edit attendance');
		}

		const dateString = event.params.date;
		const date = DateTime.fromFormat(dateString, 'yyyy-MM-dd');
		if (!date.isValid) throw error(400, 'Invalid date');

		const data = await event.request.formData();

		const personId = data.get('person')?.toString();
		if (!personId) throw error(400, 'No person provided');

		const existingEntry = await prisma.attendanceLogEntry.findFirst({
			where: {
				timestamp: date.toJSDate(),
				person: {
					id: personId
				}
			}
		});

		if (existingEntry !== null) {
			throw error(400, 'Entry already exists');
		}

		await prisma.attendanceLogEntry.create({
			data: {
				timestamp: date.toJSDate(),
				person: {
					connect: {
						id: personId
					}
				},
				source: AttendanceLogEntrySource.DASHBOARD,
				enteredBy: {
					connect: {
						id: personAdding.id
					}
				}
			},
			include: {
				person: true,
				enteredBy: true
			}
		});
	},
	deleteAttendance: async (event) => {
		const session = await event.locals.getSession();
		if (!session?.user) throw error(500);

		const personDeleting = await getPersonFromUser(session.user);
		if (!personDeleting) throw error(500);

		if (!(await hasPermission(personDeleting, 'attendance.edit'))) {
			throw error(403, 'You do not have permission to edit attendance');
		}

		const data = await event.request.formData();

		const entryId = data.get('entry')?.toString();
		if (!entryId) throw error(400, 'No entry provided');

		await prisma.attendanceLogEntry.delete({
			where: {
				id: entryId
			}
		});
	}
};

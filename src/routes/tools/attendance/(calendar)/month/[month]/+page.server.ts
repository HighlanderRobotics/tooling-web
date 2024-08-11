import prisma from '$lib/server/util/prisma.js';
import { DateTime } from 'luxon';

export const load = async ({ params }) => {
	const month = DateTime.fromFormat(params.month, 'yyyy-MM');

	// The month component also needs the days of the previous month if they're in the same week as the first day of the current month, same for the next month
	const firstDayOfMonth = month.startOf('month');
	const lastDayOfMonth = month.endOf('month');

	const firstDayOfView = firstDayOfMonth.startOf('week');
	const lastDayOfView = lastDayOfMonth.endOf('week');

	const entries = await prisma.attendanceLogEntry.findMany({
		where: {
			timestamp: {
				gte: firstDayOfView.toJSDate().toISOString(),
				lte: lastDayOfView.toJSDate().toISOString()
			}
		},
		select: {
			timestamp: true,
			personId: true
		},
		orderBy: {
			timestamp: 'asc'
		}
	});

	// Return number of entries per day
	const entriesByDay = entries.reduce((acc, entry) => {
		const day = DateTime.fromJSDate(entry.timestamp).toFormat('yyyy-MM-dd');
		acc[day] ??= [];
		if (!acc[day].includes(entry.personId)) {
			acc[day].push(entry.personId);
		}
		return acc;
	}, {} as Record<string, string[]>);

	const daysInViewCount = lastDayOfView.diff(firstDayOfView, 'days').days + 1;
	const days = Array.from({ length: daysInViewCount }, (_, i) =>
		firstDayOfView.plus({ days: i }).toFormat('yyyy-MM-dd')
	);

	return {
		month: month.toFormat('yyyy-MM'),
		days: days.map((day) => ({
			day,
			inMonth:
				DateTime.fromFormat(day, 'yyyy-MM-dd') >= firstDayOfMonth &&
				DateTime.fromFormat(day, 'yyyy-MM-dd') <= lastDayOfMonth,
			entryCount: entriesByDay[day]?.length ?? 0
		}))
	};
};

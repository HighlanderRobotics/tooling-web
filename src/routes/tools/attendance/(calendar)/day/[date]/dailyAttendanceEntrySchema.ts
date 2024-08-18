import { z } from 'zod';

export const dailyAttendanceEntrySchema = z.object({
	id: z.string(),
	timestamp: z.string(),
	source: z.string(),
	person: z.object({
		id: z.string(),
		name: z.string()
	}),
	enteredBy: z
		.object({
			name: z.string()
		})
		.or(z.null())
});

export type DailyAttendanceEntry = z.infer<typeof dailyAttendanceEntrySchema>;

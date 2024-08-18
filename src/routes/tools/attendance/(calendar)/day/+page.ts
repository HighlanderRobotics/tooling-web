import { redirect } from '@sveltejs/kit';
import { DateTime } from 'luxon';

export const load = () => {
	// Redirect to today's date if no date is specified
	throw redirect(307, `/tools/attendance/day/${DateTime.now().toFormat('yyyy-MM-dd')}`);
};

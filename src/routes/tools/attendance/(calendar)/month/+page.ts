import { redirect } from '@sveltejs/kit';
import { DateTime } from 'luxon';

export const load = () => {
	// Redirect to the current month
	throw redirect(307, `/tools/attendance/month/${DateTime.now().toFormat('yyyy-MM')}`);
};

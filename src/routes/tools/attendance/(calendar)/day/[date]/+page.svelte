<script lang="ts">
	import AttendanceEntry from './AttendanceEntry.svelte';

	import { page } from '$app/stores';
	import { DateTime } from 'luxon';
	import { Icon } from 'magnolia-ui-svelte';
	import AddAttendanceDialog from './AddAttendanceDialog.svelte';
	import { dailyAttendanceEntrySchema } from './dailyAttendanceEntrySchema';
	import { z } from 'zod';

	$: date = $page.params.date;
	$: attendanceLogEntries = z
		.array(dailyAttendanceEntrySchema)
		.parse($page.data.attendanceLogEntries);

	let addAttendeeDialogOpen = false;
</script>

<div class="nav">
	<a
		class="back"
		href="/tools/attendance/month/{DateTime.fromFormat(date, 'yyyy-MM-dd').toFormat('yyyy-MM')}"
	>
		<Icon icon="arrow_back_ios" size={22} />
		Months
	</a>
	<div class="day-nav">
		<a
			href="/tools/attendance/day/{DateTime.fromFormat(date, 'yyyy-MM-dd')
				.minus({ days: 1 })
				.toFormat('yyyy-MM-dd')}"
		>
			<Icon icon="chevron_left" />
		</a>
		<div class="date">{DateTime.fromFormat(date, 'yyyy-MM-dd').toFormat('EEEE, MMMM d, yyyy')}</div>
		<a
			href="/tools/attendance/day/{DateTime.fromFormat(date, 'yyyy-MM-dd')
				.plus({ days: 1 })
				.toFormat('yyyy-MM-dd')}"
		>
			<Icon icon="chevron_right" />
		</a>
	</div>
</div>

<div class="daily-attendance">
	<button
		class="add-attendee"
		on:click={() => {
			addAttendeeDialogOpen = true;
		}}
	>
		Add attendee
	</button>
	{#each attendanceLogEntries as entry}
		<AttendanceEntry {entry} />
	{/each}
</div>

<AddAttendanceDialog bind:open={addAttendeeDialogOpen} />

<style>
	.daily-attendance {
		display: flex;
		flex-direction: column;
		gap: 12px;
		max-width: 500px;
		margin: 0 auto;
	}

	.add-attendee {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 14px;
		border-radius: 7px;
	}

	.add-attendee {
		background-color: transparent;
		border: 2px dashed var(--light-gray);
		cursor: pointer;
		justify-content: center;
		color: var(--body);
	}

	.nav {
		background-color: var(--background);
		display: flex;
		align-items: center;
		position: sticky;
	}

	.nav .back {
		display: flex;
		align-items: center;
		text-decoration: none;
		padding: 16px;
	}

	.day-nav {
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		max-width: 300px;
	}

	.day-nav a {
		text-decoration: none;
		display: contents;
	}

	@media (max-width: 600px) {
		.nav {
			flex-direction: column;
			align-items: stretch;
		}

		.day-nav {
			width: 100%;
			max-width: unset;
			padding: 0 14px 14px 14px;
			position: static;
			transform: none;
		}
	}
</style>

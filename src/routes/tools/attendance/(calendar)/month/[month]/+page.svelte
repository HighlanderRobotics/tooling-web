<script lang="ts">
	import { page } from '$app/stores';
	import { DateTime } from 'luxon';
	import { Icon } from 'magnolia-ui-svelte';

	$: month = $page.params.month;
	$: days = $page.data.days;
</script>

<div class="calendar">
	<div class="month-header">
		<div class="nav">
			<a
				href="/tools/attendance/month/{DateTime.fromFormat(month, 'yyyy-MM')
					.minus({ months: 1 })
					.toFormat('yyyy-MM')}"
			>
				<Icon icon="chevron_left" />
			</a>
			<div class="month">{DateTime.fromFormat(month, 'yyyy-MM').toFormat('MMMM yyyy')}</div>
			<a
				href="/tools/attendance/month/{DateTime.fromFormat(month, 'yyyy-MM')
					.plus({ months: 1 })
					.toFormat('yyyy-MM')}"
			>
				<Icon icon="chevron_right" />
			</a>
		</div>
		<div class="weekdays">
			{#each days.slice(0, 7) as day}
				<div class="weekday">{DateTime.fromFormat(day.day, 'yyyy-MM-dd').toFormat('EEE')}</div>
			{/each}
		</div>
	</div>
	<div class="days">
		{#each days as day}
			<div class="day" class:out-of-month={!day.inMonth} class:has-attendees={day.entryCount > 0}>
				<div class="day-number">{DateTime.fromFormat(day.day, 'yyyy-MM-dd').day}</div>
				<div class="day-entries">
					{`${day.entryCount === 0 ? 'No' : day.entryCount} ${
						day.entryCount === 1 ? 'attendee' : 'attendees'
					}`}
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.calendar {
		max-width: 900px;
		margin: 0 auto;
	}

	.nav {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 16px;
		max-width: 230px;
		margin: 0 auto;
	}

	.nav a {
		display: contents;
	}

	.weekdays {
		display: flex;
		gap: 16px;
		padding: 16px 0;
	}

	.weekday {
		flex: 1;
		text-align: center;
	}

	.days {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		gap: 16px;
	}

	.day {
		background-color: var(--secondary-container);
		display: flex;
		flex-direction: column;
		height: 100px;
		border-radius: 7px;
	}

	.day-number {
		text-align: center;
		padding: 3px;
		font-weight: 500;
		font-size: 16px;
		border-bottom: 1px solid var(--light-gray-hover);
	}

	.day-entries {
		text-align: center;
		padding: 10px;
		font-size: 14px;
		color: var(--body);
	}

	.day.has-attendees .day-entries {
		color: var(--victory-purple);
	}

	.day.out-of-month {
		opacity: 0.4;
	}
</style>

<script lang="ts">
	import { Icon, Menu, MenuButton, MenuItem, MenuWrapper } from 'magnolia-ui-svelte';
	import type { DailyAttendanceEntry } from './dailyAttendanceEntrySchema';
	import { enhance } from '$app/forms';

	export let entry: DailyAttendanceEntry;

	let menuOpen = false;
	let deleteLoading = false;
</script>

<div class="entry">
	<img
		src="/api/people/{entry.person.id}/picture"
		height="36"
		width="36"
		alt="Profile picture of {entry.person.name}"
	/>
	<div class="text">
		<div class="name">{entry.person.name}</div>
		<div class="source">{entry.source}</div>
	</div>

	<form
		action="?/deleteAttendance"
		method="POST"
		use:enhance={() => {
			return async ({ result, update }) => {
				if (result.type === 'success') {
					menuOpen = false;
				}

				update();
			};
		}}
		on:submit={() => (deleteLoading = true)}
	>
		<input type="hidden" name="entry" value={entry.id} />
		<MenuWrapper>
			<button type="button" on:click={() => (menuOpen = true)} class="more-options">
				<Icon icon="more_vert" />
			</button>
			<Menu bind:open={menuOpen} anchor="right">
				<MenuButton disabled={deleteLoading}>Delete</MenuButton>
			</Menu>
		</MenuWrapper>
	</form>
</div>

<style>
	.entry {
		background-color: var(--secondary-container);
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 14px;
		border-radius: 7px;
	}

	.entry img {
		border-radius: 50%;
	}

	.text {
		flex: 1;
	}

	.name {
		font-size: 16px;
		font-weight: 500;
		line-height: 20px;
	}

	.source {
		font-size: 14px;
		line-height: 18px;
		color: var(--body);
	}

	.more-options {
		appearance: none;
		border: none;
		background: transparent;
		cursor: pointer;
		display: flex;
		align-items: center;
	}
</style>

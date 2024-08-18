<script lang="ts">
	import { Dialog, TextField } from 'magnolia-ui-svelte';
	import { createQuery } from '@tanstack/svelte-query';
	import z from 'zod';
	import PersonCard from './PersonCard.svelte';
	import { page } from '$app/stores';

	export let open = false;

	let filterText = '';

	const filteredPeopleSchema = z.array(z.object({ id: z.string(), name: z.string() }));

	let people: z.infer<typeof filteredPeopleSchema> = [];

	$: peopleQuery = createQuery({
		queryKey: ['people', 'filtered', { search: filterText, noAttendanceOnDay: $page.params.date }],
		queryFn: () =>
			fetch('/api/people/filtered?search=' + filterText + '&noAttendanceOnDay=' + $page.params.date)
				.then(async (res) => await res.json())
				.then((res) => filteredPeopleSchema.parse(res))
	});

	$: if ($peopleQuery.data) {
		people = $peopleQuery.data;
	}
</script>

<Dialog bind:open>
	<div class="content">
		<h1>Add attendee</h1>
		<p>If somebody attended a meeting on this day, add them here.</p>
		<label for="filter">Search</label>
		<TextField id="filter" bind:value={filterText} />
		<div class="people-container">
			{#if people.length > 0}
				<ul class="people">
					{#each people as person (person.id)}
						<PersonCard {person} on:success={() => (open = false)} />
					{/each}
				</ul>
			{:else if $peopleQuery.isLoading}
				<div class="people-message">Loading...</div>
			{:else if $peopleQuery.isError}
				<div class="people-message">Error loading people</div>
			{:else if $peopleQuery.data?.length === 0}
				<div class="people-message">No people found</div>
			{/if}
		</div>
	</div>
</Dialog>

<style>
	.content {
		display: flex;
		flex-direction: column;
	}

	p {
		color: var(--body);
	}

	label {
		display: block;
		font-size: 16px;
		font-style: normal;
		font-weight: 400;
		line-height: normal;

		margin-top: 14px;
	}

	.people {
		list-style: none;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 7px;
		padding-top: 7px;
	}

	.people-message {
		text-align: center;
		padding: 20px;
		color: var(--body);
	}

	.people-container {
		height: 200px;
		overflow-y: scroll;
	}
</style>

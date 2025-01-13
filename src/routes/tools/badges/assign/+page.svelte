<script lang="ts">
	import { page } from '$app/stores';
	import { z } from 'zod';
	import { createQuery } from '@tanstack/svelte-query';
	import { Button, TextField } from 'magnolia-ui-svelte';

	$: payload = $page.data.payload;

	let filterText = '';

	const filteredPeopleSchema = z.array(z.object({ id: z.string(), name: z.string() }));

	let people: z.infer<typeof filteredPeopleSchema> = [];

	$: peopleQuery = createQuery({
		queryKey: ['people', 'filtered', { search: filterText }],
		queryFn: () =>
			fetch('/api/people/filtered?search=' + filterText)
				.then(async (res) => await res.json())
				.then((res) => filteredPeopleSchema.parse(res))
	});

	$: if ($peopleQuery.data) {
		people = $peopleQuery.data;
	}
</script>

<div class="wrapper">
	<h1>Assign Badge</h1>
	<p>Assign this badge to a person.</p>
	<form action="?/assign" method="POST">
		<input type="hidden" name="payload" value={payload} />
		<label for="filter">Search</label>
		<TextField id="filter" bind:value={filterText} />
		<div class="people-container">
			{#if people.length > 0}
				<ul class="people">
					{#each people as person (person.id)}
						<li>
							<input type="radio" name="person" value={person.id} id={person.id} required />
							<label for={person.id}>{person.name}</label>
						</li>
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
		<Button type="submit">Assign</Button>
	</form>
</div>

<style>
	.wrapper {
		display: flex;
		flex-direction: column;
		padding: 14px;
		max-width: 500px;
		margin: 0 auto;
	}

	ul {
		list-style: none;
	}

	label {
		font-size: 16px;
		font-style: normal;
		font-weight: 400;
		line-height: normal;

		margin-top: 14px;
		margin-bottom: 7px;
	}

	form {
		display: flex;
		flex-direction: column;
		align-items: stretch;
	}

	.people-container {
		height: 200px;
		overflow-y: scroll;
		padding: 7px;
		border-radius: 7px;
		background-color: var(--secondary-container);
		margin: 14px 0;
	}
</style>

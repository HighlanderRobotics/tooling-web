<script lang="ts">
	import AddPersonDialog from './AddPersonDialog.svelte';

	import { page } from '$app/stores';
	import { localizedRole } from '$lib/util/person/role/localized';
	import type { Person } from '@prisma/client';
	import { Button, DensityProvider } from 'magnolia-ui-svelte';
	import { flip } from 'svelte/animate';
	import { fade } from 'svelte/transition';

	$: people = $page.data.people as Person[];

	let addPersonDialogOpen = false;
</script>

<svelte:head>
	<title>People | Tooling</title>
</svelte:head>

<DensityProvider density="compact">
	<table>
		<thead>
			<tr>
				<th colspan="3">
					<div class="action-bar">
						<h2>People</h2>
						{#if $page.data.permissions.edit}
							<Button variant="secondary" on:click={() => (addPersonDialogOpen = true)}>
								Add Person
							</Button>
						{/if}
					</div>
				</th>
			</tr>
			<tr class="column-labels">
				<th class="name-label">Name</th>
				<th>Email</th>
				<th>Role</th>
			</tr>
		</thead>
		<tbody>
			{#each people as person (person.email)}
				<a
					href="people/{person.id}"
					animate:flip={{ duration: 300 }}
					transition:fade={{ duration: 300 }}
				>
					<td>
						<div class="name">
							<img src="/api/people/{person.id}/picture?size=60" alt={person.name} />
							{person.name}
						</div>
					</td>
					<td>{person.email}</td>
					<td>{localizedRole(person.role)}</td>
				</a>
			{/each}
		</tbody>
	</table>

	<AddPersonDialog bind:open={addPersonDialogOpen} />
</DensityProvider>

<style>
	.action-bar {
		display: flex;
		justify-content: space-between;
	}

	table {
		border-collapse: collapse;
		width: 100%;
		overflow-x: scroll;
	}

	thead {
		position: sticky;
		z-index: 1;
		top: 65px;
		background-color: var(--background);
	}

	.name-label {
		padding-left: 48px;
	}

	th,
	td {
		padding: 8px;
		text-align: left;
	}

	tr,
	tbody a {
		display: table-row;
	}

	tbody a {
		border-bottom: 2px solid var(--light-gray-faded);
		text-decoration: none;
	}

	tbody td {
		vertical-align: middle;
	}

	td {
		max-lines: 1;
	}

	tbody a:hover {
		background-color: var(--light-gray-faded);
	}

	th {
		color: var(--on-background);
		font-weight: normal;
	}

	.column-labels {
		background-color: var(--secondary-container);
		border-bottom: 2px solid var(--light-gray-faded);
	}

	.name {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.name img {
		height: 30px;
		width: 30px;
		border-radius: 50%;
	}
</style>

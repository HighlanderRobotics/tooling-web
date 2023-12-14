<script lang="ts">
	export let canEdit: boolean;

	import CertifiedButton from './CertifiedButton.svelte';

	import { page } from '$app/stores';
	import { localizedRole } from '$lib/util/person/role/localized';
	import type { Prisma } from '@prisma/client';

	$: people = $page.data.people as Prisma.PersonGetPayload<{
		select: {
			id: true;
			name: true;
			role: true;
			email: false;
			permissions: false;
			labCertification: true;
		};
	}>[];
</script>

<table>
	<thead>
		<tr>
			<th colspan="5">
				<div class="action-bar">
					<h2>Lab Certification</h2>
				</div>
			</th>
		</tr>
		<tr class="column-labels">
			<th class="name-label">Name</th>
			<th>Role</th>
			<th class="expanded" />
			<th>Safety Quiz</th>
			<th>Emergency Preparedness</th>
			<th>Lab Layout</th>
		</tr>
	</thead>
	<tbody>
		{#each people as person (person.id)}
			<tr>
				<td>
					<div class="name">
						<img src="/api/people/{person.id}/picture?size=60" alt={person.name} />
						{person.name}
					</div>
				</td>
				<td>{localizedRole(person.role)}</td>
				<td class="expanded" />
				<td class="certified-cell">
					<CertifiedButton
						certified={person.labCertification?.safetyQuiz}
						personId={person.id}
						certification="safetyQuiz"
						{canEdit}
					/>
				</td>
				<td class="certified-cell">
					<CertifiedButton
						certified={person.labCertification?.emergencyPreparedness}
						personId={person.id}
						certification="emergencyPreparedness"
						{canEdit}
					/>
				</td>
				<td class="certified-cell">
					<CertifiedButton
						certified={person.labCertification?.labLayout}
						personId={person.id}
						certification="labLayout"
						{canEdit}
					/>
				</td>
			</tr>
		{/each}
	</tbody>
</table>

<style>
	.action-bar {
		display: flex;
		justify-content: space-between;
	}

	table {
		border-collapse: collapse;
		width: 100vw;
		overflow-x: scroll;
		/* table-layout: fixed; */
	}

	thead {
		position: sticky;
		z-index: 1;
		top: 65px;
		border-top: 2px solid var(--light-gray);
		background-color: var(--background);
	}

	.name-label {
		padding-left: 48px;
	}

	th,
	td {
		padding: 8px;
		text-align: left;
		white-space: nowrap;
		min-width: 200px;
	}

	tbody td {
		vertical-align: middle;
	}

	td {
		max-lines: 1;
	}

	.certified-cell {
		padding: 4px;
		display: table-cell;
		vertical-align: inherit;

		text-align: center;

		position: relative;
	}

	th {
		color: var(--on-background);
		font-weight: normal;
	}

	.expanded {
		width: 100%;
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

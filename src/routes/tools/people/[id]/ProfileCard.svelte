<script lang="ts">
	import LogoIcon from '$lib/assets/images/LogoIcon.svelte';
	import { localizedRole } from '$lib/util/person/role/localized.js';
	import type { Person, Prisma } from '@prisma/client';
	import { Button, DensityProvider, Icon } from 'magnolia-ui-svelte';

	export let canEdit = false;
	export let person: Prisma.PersonGetPayload<{
		select: {
			id: true;
			name: true;
			role: true;
			email: true;
			teamAffiliated: true;
			labCertification: boolean;
		};
	}>;
</script>

<div class="person">
	{#if canEdit}
		<div class="right-actions">
			<!-- <DensityProvider density="compact"> -->
			<Button variant="secondary" element="a" href="/tools/people/{person.id}/edit">Edit</Button>
			<!-- </DensityProvider> -->
		</div>
	{/if}
	<div class="flex-row">
		<img src="/api/people/{person.id}/picture?size=120" alt="Profile" />
		<div>
			<h1>{person.name}</h1>
			<h2>{localizedRole(person.role)}</h2>
		</div>
	</div>
	<div class="datum">
		<div class="label">Email</div>
		<a href="mailto:{person.email}" class="value">{person.email}</a>
	</div>
	<div class="datum">
		<div class="label">Affiliation</div>
		<div class="value">
			{person.teamAffiliated ? 'Affiliated with 8033' : 'Not affiliated with 8033'}
		</div>
	</div>
</div>

<style>
	.flex-row {
		display: flex;
		align-items: center;
		gap: 14px;
	}

	.person {
		padding: 16px;
		background-color: var(--secondary-container);
		border-radius: 14px;

		max-width: 450px;
		margin: 16px auto;
	}

	.person * {
		color: var(--body);
	}

	.right-actions {
		float: right;
	}

	img {
		width: 80px;
		height: 80px;
		border-radius: 7px;
		margin-bottom: 14px;
		background-color: var(--light-gray);
	}

	h1 {
		color: var(--on-background);
		line-height: 1;
		font-size: 16px;
	}

	h2 {
		margin-bottom: 10px;
		font-size: 16px;
		font-weight: 400;
	}

	.datum {
		display: flex;
		align-items: center;
		margin-top: 7px;
		justify-content: space-between;
	}

	.datum .label {
		font-weight: 500;
	}

	a {
		text-decoration: none;
	}
</style>

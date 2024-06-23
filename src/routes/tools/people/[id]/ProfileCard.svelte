<script lang="ts">
	import { enhance } from '$app/forms';
	import { localizedRole } from '$lib/util/person/role/localized.js';
	import { roles } from '$lib/util/person/role/roles';
	import type { Prisma } from '@prisma/client';
	import { Button, Select, TextField } from 'magnolia-ui-svelte';

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

	let editing = false;
	let editSaving = false;
	let editError: string | null = null;
</script>

{#if editing}
	<form
		action="?/edit"
		method="post"
		use:enhance={() => {
			return async ({ result, update }) => {
				editSaving = false;

				if (result.type === 'success') {
					console.log('success');

					editing = false;
				} else if (result.type === 'failure') {
					editError =
						typeof result.data?.message === 'string'
							? result.data.message
							: 'Failed to save changes.';
				}

				update();
			};
		}}
		on:submit={() => (editSaving = true)}
	>
		<div class="person">
			<div class="right-actions">
				<Button variant="secondary" type="submit" disabled={editSaving}>Save</Button>
			</div>
			<div class="flex-row">
				<img src="/api/people/{person.id}/picture?size=120" alt="Profile" />
			</div>
			<div class="field">
				<label for="name">Name</label>
				<TextField id="name" name="name" value={person.name} required />
			</div>
			<div class="field">
				<label for="email">Email</label>
				<TextField id="email" name="email" value={person.email} required />
			</div>
			<div class="field">
				<label for="role">Role</label>
				<Select
					id="role"
					name="role"
					required
					items={roles.map((role) => ({
						label: localizedRole(role),
						value: role
					}))}
					value={person.role}
				/>
			</div>
			<div class="labeled-selectable">
				<input
					type="checkbox"
					id="teamAffiliated"
					name="teamAffiliated"
					checked={person.teamAffiliated}
				/>
				<label for="teamAffiliated">Affiliated with 8033</label>
			</div>
			{#if editError}
				<div class="error">{editError}</div>
			{/if}
		</div>
	</form>
{:else}
	<div class="person">
		{#if canEdit}
			<div class="right-actions">
				<!-- <DensityProvider density="compact"> -->
				<Button variant="secondary" on:click={() => (editing = true)}>Edit</Button>
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
{/if}

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

	.field {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		gap: 7px;
	}

	label {
		font-size: 16px;
		font-style: normal;
		font-weight: 400;
		line-height: normal;

		margin-top: 14px;
	}

	.labeled-selectable {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-top: 14px;
	}

	.labeled-selectable label {
		margin: 0;
	}

	input[type='checkbox'] {
		appearance: none;
		border: 2px solid var(--light-gray);
		background-color: var(--secondary-container);
		border-radius: 5px;
		width: 24px;
		height: 24px;
		position: relative;
		transition: 100ms;
	}

	input[type='checkbox']:checked {
		background-color: var(--victory-purple);
		border: 12px solid var(--victory-purple);
	}

	input[type='checkbox']:checked::after {
		content: 'check';
		color: var(--secondary-container);
		font-family: 'Material Symbols Rounded Reduced';
		font-variation-settings: 'opsz' 22, 'GRAD' 100;
		font-size: 22px;

		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%) scaleX(0.8);
	}

	:global(.fullIconsWillLoad) input[type='checkbox']:checked::after {
		font-family: 'Material Symbols Rounded Full';
	}

	.error {
		color: var(--danger);
		margin-top: 14px;
	}
</style>

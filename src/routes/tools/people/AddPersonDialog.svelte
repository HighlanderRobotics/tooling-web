<script lang="ts">
	import { enhance } from '$app/forms';
	import { onNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import { localizedRole } from '$lib/util/person/role/localized';
	import { roles } from '$lib/util/person/role/roles';
	import type { Person } from '@prisma/client';
	import { error } from '@sveltejs/kit';
	import { Button, DensityProvider, Dialog, TextField, Select } from 'magnolia-ui-svelte';

	$: people = $page.data.people as Person[];

	export let open = false;

	onNavigate(() => {
		if (!$page.form?.error) {
			open = false;
		}
	});
</script>

<Dialog bind:open>
	<h2>Add a person</h2>
	<form
		method="POST"
		action="?/addPerson"
		use:enhance={() => {
			return async ({ result, update }) => {
				if (result.type === 'success') {
					open = false;
				}

				update();
			};
		}}
	>
		<label for="name">Name</label>
		<TextField id="name" name="name" required />
		<label for="email">Email</label>
		<TextField
			id="email"
			name="email"
			type="email"
			required
			errorMessage={$page.form?.field === 'email' ? $page.form?.message : null}
		/>
		<label for="role">Role</label>
		<Select
			id="role"
			name="role"
			required
			items={roles.map((role) => ({
				label: localizedRole(role),
				value: role
			}))}
		/>
		<div class="labeled-selectable">
			<input type="checkbox" id="teamAffiliated" name="teamAffiliated" />
			<label for="teamAffiliated">Affiliated with 8033</label>
		</div>
		<div class="actions">
			<Button type="button" variant="secondary" on:click={() => (open = false)}>Cancel</Button>
			<Button>Add</Button>
		</div>
	</form>
</Dialog>

<style>
	form {
		display: flex;
		flex-direction: column;
		align-items: stretch;
	}

	label {
		font-size: 16px;
		font-style: normal;
		font-weight: 400;
		line-height: normal;

		margin-top: 14px;
		margin-bottom: 7px;
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
		font-family: 'Material Symbols Rounded';
		font-variation-settings: 'opsz' 22, 'GRAD' 100;
		font-size: 22px;

		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%) scaleX(0.8);
	}

	.actions {
		display: flex;
		justify-content: end;
		gap: 7px;
		margin-top: 19px;
	}
</style>

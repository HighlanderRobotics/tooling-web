<script lang="ts">
	import { enhance } from '$app/forms';
	import { onNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import { localizedRole } from '$lib/util/person/role/localized';
	import { roles } from '$lib/util/person/role/roles';
	import { Button, Dialog, TextField, Select } from 'magnolia-ui-svelte';
	import { createEventDispatcher } from 'svelte';

	export let showCancel = false;

	const dispatch = createEventDispatcher();

	function onSuccess() {
		dispatch('success');
	}

	function onCancel() {
		dispatch('cancel');
	}
</script>

<h2>Add a person</h2>
<form
	method="POST"
	action="/tools/people?/addPerson"
	use:enhance={() => {
		console.log('ay');
		return async ({ result, update }) => {
			if (result.type === 'success') {
				onSuccess();
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
		{#if showCancel}
			<Button type="button" variant="secondary" on:click={onCancel}>Cancel</Button>
		{/if}
		<Button>Add</Button>
	</div>
</form>

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

	.actions {
		display: flex;
		justify-content: end;
		gap: 7px;
		margin-top: 19px;
	}
</style>

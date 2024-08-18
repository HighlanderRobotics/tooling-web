<script lang="ts">
	import { Button, DensityProvider } from 'magnolia-ui-svelte';
	import type { FilteredPerson } from '../../../../../api/people/filtered/+server';
	import { enhance } from '$app/forms';
	import { createEventDispatcher } from 'svelte';

	export let person: FilteredPerson;

	let loading = false;

	const dispatch = createEventDispatcher();

	function onSuccess() {
		dispatch('success');
	}
</script>

<li class="person">
	<form
		action="?/addAttendance"
		method="POST"
		use:enhance={() => {
			return async ({ result, update }) => {
				if (result.type === 'success') {
					onSuccess();
				}

				update();
			};
		}}
		on:submit={() => (loading = true)}
	>
		<input type="hidden" name="person" value={person.id} />
		<img src="/api/people/{person.id}/picture" alt="Profile picture of {person.name}" />
		<div class="name">{person.name}</div>
		<DensityProvider density="compact">
			<Button variant="primary" type="submit">Add</Button>
		</DensityProvider>
	</form>
</li>

<style>
	.person {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 10px;
		border-radius: 7px;
		background-color: var(--secondary-container);
	}

	form {
		display: contents;
	}

	.person img {
		width: 35px;
		height: 35px;
		border-radius: 50%;
		object-fit: cover;
	}

	.person .name {
		flex: 1;
	}
</style>

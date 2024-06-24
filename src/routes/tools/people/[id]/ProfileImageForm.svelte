<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from 'magnolia-ui-svelte';

	export let dialogOpen: boolean;
	let saving = false;
	let errorMessage: string | null;
</script>

<form
	on:submit={() => (saving = true)}
	use:enhance={() => {
		console.log('ay');
		return async ({ result, update }) => {
			saving = false;

			if (result.type === 'success') {
				dialogOpen = false;
			}

			if (result.type === 'failure') {
				errorMessage =
					typeof result.data?.message === 'string' ? result.data.message : 'Failed to save image';
			}

			update();
		};
	}}
	action="?/uploadImage"
	method="post"
	enctype="multipart/form-data"
>
	<input type="file" name="image" required />
	<div>
		{#if errorMessage}
			<p class="error">{errorMessage}</p>
		{/if}
		<Button
			type="button"
			disabled={saving}
			variant="secondary"
			on:click={() => (dialogOpen = false)}>Cancel</Button
		>
		<Button type="submit" disabled={saving}>Save</Button>
	</div>
</form>

<style>
	.error {
		color: var(--danger);
	}
</style>

<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from 'magnolia-ui-svelte';
	import Dropzone from 'svelte-file-dropzone';

	export let dialogOpen: boolean;
	let saving = false;
	let errorMessage: string | null;

	let form: HTMLFormElement;
</script>

<form
	bind:this={form}
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
	<h1>Upload an image</h1>
	<p>
		Use a photograph containing this person's face on a neutral backdrop. These are used for the
		website and badges, so make sure they're recognizable.
	</p>
	<Dropzone
		required
		disableDefaultStyles
		containerClasses="styled-dropzone"
		name="image"
		accept="image/jpeg"
		multiple={false}
		disabled={saving}
		on:drop={() => {
			form.requestSubmit();
			form.reset();
		}}
	>
		{#if saving}
			<p>Uploading...</p>
		{:else if errorMessage}
			<p class="error">{errorMessage}</p>
		{:else}
			<p>Drop photo here or click to browse</p>
		{/if}
	</Dropzone>
	<div>
		<Button
			type="button"
			disabled={saving}
			variant="secondary"
			on:click={() => (dialogOpen = false)}
		>
			Cancel
		</Button>
	</div>
</form>

<style>
	.error {
		color: var(--danger);
	}

	p {
		color: var(--body);
		margin-bottom: 14px;
	}

	:global(.styled-dropzone) {
		background-color: var(--secondary-container);
		height: 150px;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 7px;
		border: 2px solid var(--light-gray);
		margin-bottom: 14px;
	}
</style>

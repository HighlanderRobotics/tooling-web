<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from 'magnolia-ui-svelte';

	export let dialogOpen: boolean;
</script>

<form use:enhance action="?/uploadImage" method="post" enctype="multipart/form-data">
	<input type="file" name="image" required />
	<div>
		<Button type="button" variant="secondary" on:click={() => (dialogOpen = false)}>Cancel</Button>
		<Button type="submit">Save</Button>
	</div>
</form>

<style>
</style>

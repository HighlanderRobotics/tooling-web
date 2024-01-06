<script lang="ts">
	import AddPersonForm from './AddPersonForm.svelte';

	import { onNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import { Dialog } from 'magnolia-ui-svelte';

	export let open = false;

	onNavigate(() => {
		if (!$page.form?.error) {
			open = false;
		}
	});
</script>

<Dialog bind:open>
	<AddPersonForm
		on:success={() => open = false}
		on:cancel={() => open = false}
		showCancel
	/>
</Dialog>

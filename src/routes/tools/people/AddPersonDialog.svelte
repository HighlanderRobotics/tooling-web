<script lang="ts">
  import AddPeopleBulkForm from './AddPeopleBulkForm.svelte';

	import AddPersonForm from './AddPersonForm.svelte';

	import { onNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import { Button, Dialog } from 'magnolia-ui-svelte';

	export let open = false;

	$: {
		if (!open) {
			type = DialogType.SIGNLE;
		}
	}

	enum DialogType {
		SIGNLE,
		BULK,
	}

	let type: DialogType = DialogType.SIGNLE;

	onNavigate(() => {
		if (!$page.form?.error) {
			open = false;
		}
	});
</script>

<Dialog bind:open>
	{#if type === DialogType.SIGNLE}
		<AddPersonForm
			on:success={() => open = false}
			on:cancel={() => open = false}
			on:bulkImport={() => type = DialogType.BULK}
			showCancel
			showBulkImport
		/>
	{:else if type === DialogType.BULK}
		<AddPeopleBulkForm
			on:success={() => open = false}
			on:cancel={() => open = false}
			on:singleAdd={() => type = DialogType.SIGNLE}
			showCancel
		/>
	{/if}
</Dialog>

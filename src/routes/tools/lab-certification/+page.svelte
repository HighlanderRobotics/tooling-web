<script lang="ts">
	import CertificationTable from './CertificationTable.svelte';

	import { page } from '$app/stores';
	import { DensityProvider } from 'magnolia-ui-svelte';
</script>

<svelte:head>
	<title>Lab Certification | Tooling</title>
</svelte:head>
<DensityProvider density="compact">
	<CertificationTable canEdit={$page.data.permissions.edit} />
</DensityProvider>

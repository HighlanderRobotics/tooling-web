<script lang="ts">
	import CertificationTable from './CertificationTable.svelte';

	import { page } from '$app/stores';
	import type { Person, Prisma } from '@prisma/client';
	import { Button, DensityProvider } from 'magnolia-ui-svelte';
	import { enhance } from '$app/forms';

	$: people = $page.data.people as Prisma.PersonGetPayload<{
		select: {
			id: true;
			name: true;
			role: true;
			email: false;
			permissions: false;
			labCertification: true;
		};
	}>[];
</script>

<svelte:head>
	<title>Lab Certification | Tooling</title>
</svelte:head>
<DensityProvider density="compact">
	<CertificationTable canEdit={$page.data.permissions.edit} />
</DensityProvider>

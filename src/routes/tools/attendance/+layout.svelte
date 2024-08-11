<script>
	import Navbar from '$lib/components/Navbar.svelte';
</script>

<svelte:head>
	<title>Attendance | Tooling</title>
</svelte:head>

<Navbar>
	<svelte:fragment slot="title">Attendance</svelte:fragment>
</Navbar>
<slot />

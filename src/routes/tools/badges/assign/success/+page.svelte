<script lang="ts">
	import { Button } from 'magnolia-ui-svelte';
	import type { PageData } from './$types';
</script>

<svelte:head>
	<title>Safety Quiz</title>
</svelte:head>

<div class="main">
	<h1>Badge assigned.</h1>
	<p>You should now be able to scan it at the kiosk.</p>
</div>

<style>
	.main {
		max-width: 600px;
		margin: 0 auto;
		padding: 0 20px;
	}

	p {
		margin-bottom: 10px;
	}
</style>

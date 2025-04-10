<script>
	import LabCertificationThumbnail from '$lib/assets/images/tool-thumbnails/LabCertificationThumbnail.svelte';
	import PeopleThumbnail from '$lib/assets/images/tool-thumbnails/PeopleThumbnail.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
</script>

<svelte:head>
	<title>Tools | Tooling</title>
</svelte:head>

<Navbar />

<div class="tools">
	<a href="/tools/people" class="card">
		<PeopleThumbnail />
		<div class="text">
			<h1>People</h1>
			<p>View people associated with the team and manage their information.</p>
		</div>
	</a>

	<a href="/tools/lab-certification" class="card">
		<LabCertificationThumbnail />
		<div class="text">
			<h1>Lab Certification</h1>
			<p>
				Track whether students, mentors, and supervisors have the safety knowledge necessary to be
				in the lab.
			</p>
		</div>
	</a>
</div>

<style>
	.tools {
		display: grid;
		grid-template-columns: repeat(auto-fit, 234px);
		grid-gap: 26px;
		justify-content: center;
		padding: 26px;
		margin: 0 auto;
		max-width: 1200px;
	}

	a {
		text-decoration: none;
	}

	.card {
		max-width: 234px;
		border-radius: 7px;
		background-color: var(--secondary-container);
		overflow: hidden;
		transition: background-color 150ms;
	}

	.card:hover {
		background-color: var(--light-gray);
	}

	h1 {
		font-size: 20px;
		font-style: normal;
		font-weight: 500;
		line-height: 32px;
	}

	p {
		color: var(--body);
		font-size: 14px;
		font-style: normal;
		font-weight: 400;
		line-height: normal;
	}

	.text {
		padding: 10px;
	}
</style>

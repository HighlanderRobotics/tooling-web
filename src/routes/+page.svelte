<script>
	import { signIn } from '@auth/sveltekit/client';
	import { Button } from 'magnolia-ui-svelte';
	import LogoIcon from '$lib/assets/images/LogoIcon.svelte';
</script>

<svelte:head>
	<title>Sign in to Tooling</title>
</svelte:head>

<div class="wrapper">
	<div class="logo">
		<LogoIcon height="500px" width="500px" fill="var(--light-gray)" />
	</div>
	<div class="content">
		<h1>Sign in to Tooling</h1>
		<p>You must be signed in to access this service.</p>
		<div class="button-wrapper">
			<Button on:click={() => signIn('google')}>Sign in</Button>
		</div>
	</div>
	<div class="footer">
		<p>Copyright © 2023 Highlander Robotics</p>
	</div>
</div>

<style>
	p {
		margin-bottom: 10px;
		color: var(--body);
	}

	.wrapper {
		display: grid;
		place-items: center;

		height: 100vh;
	}

	.button-wrapper {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		padding-top: 10px;
	}

	.content {
		/* --secondary-container: #005500; */
		background-color: var(--secondary-container);
		padding: 15px;
		border-radius: 7px;

		margin: 15px;

		position: relative;
	}

	.footer {
		position: absolute;
		bottom: 5px;
		text-align: center;
		width: 100%;
	}

	.logo {
		position: absolute;
		top: calc(50vh);
		left: calc(50vw);
		transform: translate(-50%, -50%);
	}

	@media only screen and (max-width: 450px) {
		.content {
			background-color: transparent;
		}
	}
</style>

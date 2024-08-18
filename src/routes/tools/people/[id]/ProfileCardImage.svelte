<script lang="ts">
	import ProfileImageForm from './ProfileImageForm.svelte';

	import type { Prisma } from '@prisma/client';
	import { Dialog, Icon } from 'magnolia-ui-svelte';

	export let canEdit = false;

	export let person: Prisma.PersonGetPayload<{
		select: {
			id: true;
			name: true;
			role: true;
			email: true;
			teamAffiliated: true;
			labCertification: boolean;
		};
	}>;

	let dialogOpen = false;
</script>

<div class="profile-card-image">
	{#if canEdit}
		<button type="button" on:click={() => (dialogOpen = true)}>
			<img src="/api/people/{person.id}/picture?size=120" alt="Profile" />
			<div class="icon-container">
				<Icon icon="edit" />
			</div>
		</button>
	{:else}
		<img src="/api/people/{person.id}/picture?size=120" alt="Profile" />
	{/if}
</div>

<Dialog bind:open={dialogOpen}>
	<ProfileImageForm bind:dialogOpen />
</Dialog>

<style>
	.profile-card-image {
		width: 80px;
		height: 80px;
		border-radius: 7px;
		margin-bottom: 14px;
		overflow: hidden;
		position: relative;
	}

	img {
		background-color: var(--light-gray);
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		transition: opacity 100ms;
	}

	button {
		appearance: none;
		cursor: pointer;
		background: none;
		border: none;
		margin: 0;
		padding: 0;

		height: 100%;
		width: 100%;

		display: flex;
		justify-content: center;
		align-items: center;

		position: relative;
	}

	.icon-container {
		position: relative;

		background-color: var(--light-gray);
		height: 48px;
		width: 48px;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 50%;
		opacity: 0%;
		transition: opacity 100ms;
	}

	button:hover .icon-container {
		opacity: 100%;
	}

	button:hover img {
		opacity: 70%;
	}
</style>

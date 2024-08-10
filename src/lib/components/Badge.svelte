<script lang="ts">
	import badgeBackground from '$lib/assets/images/badge-background.png';

	export let name: string;
	export let position: string | undefined;
	export let school: string | undefined;
	export let graduationYear: number | undefined;
	export let imageUrl: string | undefined;
</script>

<div class="wrapper">
	<img
		class="badge-background"
		src={badgeBackground}
		alt="Badge background"
		width="100%"
		height="100%"
	/>
	<div class="content">
		<div class="image">
			{#if imageUrl}
				<img src={imageUrl} alt="Photo of {name}" width="100" height="100" />
			{/if}
		</div>
		<div class="text">
			<div class="name">{name}</div>
			<div class="additional-field">{position}</div>
			{#if school}
				<div class="additional-field">
					{school}
				</div>
			{/if}
			{#if graduationYear}
				<div class="additional-field">
					Class of {graduationYear}
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	* {
		display: flex;
		flex-direction: column;
		--scale: 4;
	}

	.badge-background {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	.wrapper {
		height: 100%;
	}

	.content {
		margin-left: 252px;
		padding: 60px;
	}

	.text {
		font-size: 48px;
	}

	.name {
		font-size: 54px;
		margin-bottom: 10px;
		font-weight: bold;
		color: #350868;
	}

	.image img {
		width: 100%;
		height: 100%;
	}

	.image {
		height: 546px;
		width: 546px;
		border-radius: 18px;
		overflow: hidden;
		margin-bottom: 20px;
		background-color: #dbdbdb;
	}
</style>

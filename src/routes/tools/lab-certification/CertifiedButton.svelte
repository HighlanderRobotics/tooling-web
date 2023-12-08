<script lang="ts">
	import { cubicOut } from 'svelte/easing';

	export let certified = false;
	export let personId: string;
	export let certification: 'safetyQuiz' | 'emergencyPreparedness' | 'labLayout';

	export let canEdit = true;
	export let onSecondaryContainer = false;

	let pendingUpdate: boolean | null = null;

	$: displayCertified = pendingUpdate !== null ? pendingUpdate : certified;

	function blurScale(
		node: HTMLElement,
		{
			delay = 0,
			duration = 300,
			easing = cubicOut,
			scaleX = 1,
			scaleY = 1
		}: {
			delay?: number;
			duration?: number;
			easing?: (t: number) => number;
			scaleX?: number;
			scaleY?: number;
		} = {}
	) {
		const style = getComputedStyle(node);
		const opacity = +style.opacity;
		const transform = style.transform === 'none' ? '' : style.transform;

		const map = (t: number, a: number, b: number, u: number, v: number) =>
			((t - a) / (b - a)) * (v - u) + u;

		return {
			delay,
			duration,
			easing,
			css: (t: number) => `
                opacity: ${t * opacity};
                transform: scaleX(${map(t, 0, 1, scaleX, 1)}) scaleY(${map(
				t,
				0,
				1,
				scaleY,
				1
			)}) ${transform};
                filter: blur(${(1 - t) * 4}px);
            `
		};
	}

	const localizedCertification = {
		safetyQuiz: 'Safety Quiz',
		emergencyPreparedness: 'Emergency Preparedness',
		labLayout: 'Lab Layout'
	};
</script>

<button
	formaction={canEdit && pendingUpdate == null
		? `?/${certified ? 'unCertify' : 'certify'}&person=${encodeURIComponent(
				personId
			)}&certification=${encodeURIComponent(certification)}`
		: null}
	role={canEdit ? 'button' : 'text'}
	aria-busy={pendingUpdate != null}
	aria-label={canEdit ? (
		`Currently ${displayCertified ? 'certified' : 'not certified'} for ${localizedCertification[certification]}. Toggle.`
	) : (
		`Currently ${displayCertified ? 'certified' : 'not certified'} for ${localizedCertification[certification]}.`
	)}
	on:click={() => {
		if (!canEdit || pendingUpdate != null) return;

		pendingUpdate = !certified;
		setTimeout(() => (pendingUpdate = null), 1000);
	}}
	class:certified={displayCertified}
	class:onSecondaryContainer
>
	{#if displayCertified}
		<span class="absolute" transition:blurScale={{ scaleX: 1.5 }}>Certified</span>
	{:else}
		<span class="absolute" transition:blurScale={{ scaleX: 0.5 }}>Not certified</span>
	{/if}
	<span class="hidden" aria-hidden="true">Not certified</span>
</button>


<style>
	button {
		background-color: var(--secondary-container);
		border: none;
		border-radius: 7px;
		padding: 8px 14px;
		width: 100%;
		position: relative;

		transition: background-color 0.3s;
	}

	.onSecondaryContainer {
		background-color: var(--background);
	}

	.absolute {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		transform-origin: top left;
	}

	span {
		white-space: nowrap;
	}

	.certified {
		background-color: #086826;
		--on-background: #fff;
	}

	.hidden {
		opacity: 0;
		user-select: none;
	}
</style>

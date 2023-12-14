<script lang="ts">
	import { enhance } from '$app/forms';
	import type { Prisma } from '@prisma/client';
	import CertifiedButton from '../../lab-certification/CertifiedButton.svelte';
	import ProfileCard from './ProfileCard.svelte';
	import { Icon } from 'magnolia-ui-svelte';

	export let person: Prisma.PersonGetPayload<{
		select: {
			id: true;
			name: true;
			role: true;
			email: true;
			teamAffiliated: true;
			labCertification: true;
		};
	}>;

	export let canEdit: boolean;
</script>

<div class="card">
	<h1>Lab Certification</h1>
	<div class="criterion">
		<div class="label">Safety Quiz</div>
		<div class="value">
			<CertifiedButton
				certified={person.labCertification?.safetyQuiz}
				personId={person.id}
				certification="safetyQuiz"
				onSecondaryContainer={true}
				{canEdit}
			/>
		</div>
	</div>
	<div class="criterion">
		<div class="label">Emergency Preparedness</div>
		<div class="value">
			<CertifiedButton
				certified={person.labCertification?.emergencyPreparedness}
				personId={person.id}
				certification="emergencyPreparedness"
				onSecondaryContainer={true}
				{canEdit}
			/>
		</div>
	</div>
	<div class="criterion">
		<div class="label">Lab Layout</div>
		<div class="value">
			<CertifiedButton
				certified={person.labCertification?.labLayout}
				personId={person.id}
				certification="labLayout"
				onSecondaryContainer={true}
				{canEdit}
			/>
		</div>
	</div>
</div>

<style>
	.card {
		padding: 16px;
		background-color: var(--secondary-container);
		border-radius: 14px;

		max-width: 450px;
		margin: 16px auto;
	}

	h1 {
		font-size: 18px;
	}

	.criterion {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 7px;
	}

	.label {
		color: var(--body);
		font-weight: 500;
	}
</style>

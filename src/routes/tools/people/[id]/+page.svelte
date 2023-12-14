<script lang="ts">
	import LabCertificationCard from './LabCertificationCard.svelte';

	import ProfileCard from './ProfileCard.svelte';
	import { Icon } from 'magnolia-ui-svelte';

	export let data;

	$: person = data.person;
</script>

<div class="page">
	<div class="top">
		<a class="back" href="/tools/people">
			<Icon icon="arrow_back_ios" size={22} />
			<span>All people</span>
		</a>
	</div>

	<div class="cards">
		<ProfileCard canEdit={data.permissions.people.edit} {person} />
		<LabCertificationCard canEdit={data.permissions.labCertification.edit} {person} />
	</div>
</div>

<style>
	.top {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.page {
		margin: 16px;
	}

	a {
		text-decoration: none;
	}

	.back {
		display: flex;
		align-items: center;
	}

	.back span {
		margin-left: -2px;
	}
</style>

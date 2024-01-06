<script lang="ts">
	import { Button, DensityProvider } from "magnolia-ui-svelte";
    import type { PageData } from "./$types";
	import { QuizType } from "@prisma/client";
	import formatTimestamp from "$lib/util/formatTimestamp";

    export let data: PageData;
</script>

<DensityProvider density="compact">
	<table>
		<thead>
			<tr>
				<th colspan="4">
					<div class="action-bar">
						<h2>Quiz Submissions</h2>
					</div>
				</th>
			</tr>
			<tr class="column-labels">
				<th class="name-label">Submitted by</th>
				<th>Quiz</th>
				<th>Score</th>
                <th>Submitted at</th>
			</tr>
		</thead>
		<tbody>
			{#each data.submissions as submission (submission.id)}
				<a
					href="quiz-results/{submission.id}"
				>
					<td>
						<div class="name" class:email={!submission.submitter}>
							{#if submission.submitter}
                                <img src="/api/people/{submission.submitter.id}/picture?size=60" alt={submission.submitter.name} />
                                {submission.submitter.name}
                            {:else}
                                {submission.submitterEmail}
                            {/if}
						</div>
					</td>
                    <td>{[
                        {
                            id: QuizType.SAFETY_QUIZ,
                            name: "Safety Quiz",
                        },
                        {
                            id: QuizType.LAB_LAYOUT_EMERGENCY_PREPAREDNESS,
                            name: "Lab Layout/Emergency Preparedness",
                        },
                    ].find(i => i.id === submission.quizType)?.name}</td>
                    <td>{submission.score}/{submission.maxScore}</td>
                    <td>{formatTimestamp(submission.timestamp)}</td>
				</a>
			{/each}
		</tbody>
	</table>
</DensityProvider>

<style>
	.action-bar {
		display: flex;
		justify-content: space-between;
	}

	table {
		border-collapse: collapse;
		width: 100%;
		overflow-x: scroll;
	}

	thead {
		position: sticky;
		z-index: 1;
		top: 64px;
		background-color: var(--background);
	}

	.name-label {
		padding-left: 48px;
	}

	th,
	td {
		padding: 8px;
		text-align: left;
	}

	tr,
	tbody a {
		display: table-row;
	}

	tbody a {
		border-bottom: 2px solid var(--light-gray-faded);
		text-decoration: none;
	}

	tbody td {
		vertical-align: middle;
	}

	td {
		max-lines: 1;
	}

	tbody a:hover {
		background-color: var(--light-gray-faded);
	}

	th {
		color: var(--on-background);
		font-weight: normal;
	}

	.column-labels {
		background-color: var(--secondary-container);
		border-bottom: 2px solid var(--light-gray-faded);
	}

	.name {
		display: flex;
		align-items: center;
		gap: 10px;
	}

    .name.email {
        padding-left: 40px;
    }

	.name img {
		height: 30px;
		width: 30px;
		border-radius: 50%;
	}
</style>

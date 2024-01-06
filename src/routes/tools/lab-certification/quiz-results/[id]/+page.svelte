<script lang="ts">
  import Question from './Question.svelte';

	import { Icon } from "magnolia-ui-svelte";

    import type { PageData } from "./$types";
	import { QuestionType } from '$lib/util/lab-certification/quizzes';
	import formatTimestamp from '$lib/util/formatTimestamp';

    export let data: PageData;

    $: questions = JSON.parse(data.submission.answers) as Record<string, string | string[]>
</script>
<div class="page">
	<div class="top">
		<a class="back" href="/tools/lab-certification/quiz-results">
			<Icon icon="arrow_back_ios" size={22} />
			<span>Submissions</span>
		</a>
	</div>

	<div class="main">
        <div class="meta">
            <h2>
                Quiz Results
                <span class="score">
                    {data.submission.score}/{data.submission.maxScore}
                </span>
            </h2>
            <p>
                {#if data.submission.submitter}
                    <a href={`/tools/people/${data.submission.submitter.id}`}>{data.submission.submitter.name}</a>
                {:else}
                    {data.submission.submitterEmail}
                {/if}
                - {formatTimestamp(data.submission.timestamp)}
            </p>
            {#if !data.submission.submitter}
                <p>This email isn't recognized in the database.</p>
            {/if}
        </div>

        <div class="results">
            {#each Object.entries(questions) as [question, answer]}
                <Question
                    question={data.questionList.find(q => q.id === question)}
                    answer={answer}
                    isCorrect={JSON.stringify(data.questionList.find(q => q.id === question)?.correctAnswer) === JSON.stringify(answer)}
                />
            {/each}
        </div>
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

    .main {
        max-width: 600px;
        margin: 0 auto;
    }

    .score {
        font-weight: 400;
        color: var(--body);
    }

    .meta {
        padding-left: 31px;
        padding-bottom: 8px;
        margin-bottom: 8px;
        border-bottom: 2px solid var(--light-gray);
        margin-top: 16px;
    }

    p {
        color: var(--body);
    }

    p a {
        color: var(--body);
        text-decoration: underline;
    }
</style>
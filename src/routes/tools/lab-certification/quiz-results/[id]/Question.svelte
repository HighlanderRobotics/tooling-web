<script lang="ts">
	import type { ServerQuestion } from "$lib/util/lab-certification/quizzes";
	import { Icon } from "magnolia-ui-svelte";

    export let question: ServerQuestion<string | string[]> | undefined;
    export let answer: string | string[];
    export let isCorrect: boolean;
</script>

<div class="question">
    <Icon
        icon={isCorrect ? "check" : "close"}
        color={isCorrect ? "green" : "var(--danger)"}
    />
    <div>
        <h3>{question?.readableName}</h3>
        {#if typeof answer === 'string'}
            <p>{question?.answers[answer]}</p>
        {:else}
            <ul>
                {#each answer as item}
                    <li>{question?.answers[item]}</li>
                {/each}
            </ul>
        {/if}
    </div>
</div>

<style>
	.question {
        display: flex;
        gap: 7px;
        margin-bottom: 16px;
    }

    p, li {
        color: var(--body);
    }
</style>


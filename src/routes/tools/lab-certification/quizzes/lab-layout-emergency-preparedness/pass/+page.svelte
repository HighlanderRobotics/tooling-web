<script lang="ts">
    import { Button } from 'magnolia-ui-svelte';
    import type { PageData } from './$types';

    export let data: PageData;
</script>

<svelte:head>
    <title>Safety Quiz</title>
</svelte:head>

<div class="main">
    <div class="score">
        <span class="red">{data.score}</span>/{data.total}
    </div>
    <h1>You passed!</h1>
    {#if data.score === data.total.toString()}
        <p>Perfect score.</p>
    {:else}
        <p>Let's take a look at what you got wrong.</p>

        <Button element="a" href="/tools/lab-certification/quizzes/lab-layout-emergency-preparedness">Take again</Button>

        <div class="missed">
            <h2>What you missed</h2>
            <ul>
                {#each data.incorrectQuestions as question}
                    <li>{question.readableName}</li>
                {/each}
            </ul>
        </div>
    {/if}
</div>

<style>
    .main {
        max-width: 600px;
        margin: 0 auto;
        padding: 0 20px;
    }

    .score {
        font-size: 48px;
    }

    p {
        margin-bottom: 10px;
    }

    .missed {
        margin-top: 20px;
        padding: 14px;
        background-color: var(--secondary-container);
        border-radius: 7px;
    }

    h2 {
        line-height: 1em;
        margin-bottom: 7px;
    }

    ul {
        margin: 0;
        padding: 0;
        list-style: none;
    }

    li {
        color: var(--body);
        margin-top: 7px;
    }
</style>

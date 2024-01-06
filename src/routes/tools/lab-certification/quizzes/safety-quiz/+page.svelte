<script lang="ts">
	import { enhance } from "$app/forms";
	import { Button, Select, TextField } from "magnolia-ui-svelte";
    import { page } from "$app/stores";

    import type { PageData } from "./$types";
	import { QuestionType } from "$lib/util/lab-certification/quizzes";

    export let data: PageData;

    let loading = false;
</script>

<svelte:head>
    <title>Safety Quiz</title>
</svelte:head>

<div class="main">
    <h1>Safety Quiz</h1>
    <form method="post" use:enhance on:submit={() => loading = true}>
        {#if !$page.data.session?.user}
            <div class="field">
                <label class="label" for="email">Email address</label>
                <TextField type="email" id="email" name="email" required />
            </div>
        {/if}

        {#each data.questions as question}
            <div class="field">
                {#if question.type === QuestionType.SINGLE_SELECT}
                    <label class="label" for={question.id}>{question.readableName}</label>
                    <Select
                        id={question.id}
                        name={question.id}
                        placeholder="Select an option"
                        required
                        items={Object.entries(question.answers).map(([value, label]) => ({ value, label }))}
                    />
                {:else if question.type === QuestionType.MULTI_SELECT}
                    <div class="label">{question.readableName}</div>
                    <div class="options">
                        {#each Object.entries(question.answers) as [value, label]}
                            <div class="option">
                                <input type="checkbox" id={question.id + "__" + value} name={question.id + "__" + value} />
                                <label for={question.id + "__" + value}>{label}</label>
                            </div>
                        {/each}
                    </div>
                {/if}
            </div>
        {/each}

        <div class="submit-button">
            <Button type="submit" disabled={loading}>Submit</Button>
        </div>
    </form>
</div>

<style>
    .main {
        max-width: 600px;
        margin: 0 auto;
        padding: 0 20px;
    }

    form {
        padding-bottom: 200px;
    }

    .submit-button {
        padding-top: 40px;
        display: flex;
        justify-content: flex-end;
    }

    .field {
        margin-bottom: 20px;
        display: flex;
        flex-direction: column;
        align-items: stretch;
        gap: 7px;
    }

    .label {
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;

        margin-top: 14px;
    }

    .option {
        display: flex;
        align-items: center;
        gap: 7px;

        margin-bottom: 7px;
    }

    input[type='checkbox'] {
		appearance: none;
		border: 2px solid var(--light-gray);
		background-color: var(--secondary-container);
		border-radius: 5px;
		width: 24px;
		height: 24px;
		position: relative;
		transition: 100ms;
	}

	input[type='checkbox']:checked {
		background-color: var(--victory-purple);
		border: 12px solid var(--victory-purple);
	}

	input[type='checkbox']:checked::after {
		content: 'check';
		color: var(--secondary-container);
		font-family: 'Material Symbols Rounded';
		font-variation-settings: 'opsz' 22, 'GRAD' 100;
		font-size: 22px;

		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%) scaleX(0.8);
	}
</style>

<script lang="ts">
	import { Button } from 'magnolia-ui-svelte';
	import { createEventDispatcher } from 'svelte';

    export let showCancel = false;

    const dispatch = createEventDispatcher();

    function onSuccess() {
        dispatch('success');
    }

    function onCancel() {
        dispatch('cancel');
    }

    function onSingleAdd() {
        dispatch('singleAdd');
    }
</script>

<form
    method="POST"
    action="/tools/people?/addPeopleBulk"
>
    <label for="csv">CSV</label>
    <textarea id="csv" name="csv" required />
    <div class="actions">
        <Button variant="secondary" on:click={onSingleAdd}>Add single person</Button>
        <div class="right">
            {#if showCancel}
                <Button variant="secondary" on:click={onCancel}>Cancel</Button>
            {/if}
            <Button type="submit">Add people</Button>
        </div>
    </div>
</form>

<style>
	form {
		display: flex;
		flex-direction: column;
		align-items: stretch;
	}

	label {
		font-size: 16px;
		font-style: normal;
		font-weight: 400;
		line-height: normal;

		margin-top: 14px;
		margin-bottom: 7px;
	}
    
    .actions {
        margin-top: 19px;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
    }

	.right {
		display: flex;
		justify-content: end;
		gap: 7px;
	}
</style>

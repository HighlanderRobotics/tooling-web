<script lang="ts">
    import { page } from "$app/stores";
    import type { Person } from "@prisma/client";
	import { Button, DensityProvider } from "magnolia-ui-svelte";

    $: people = $page.data.people as Person[];
</script>

<svelte:head>
    <title>Roster | Tooling</title>
</svelte:head>

<DensityProvider density="compact">
    <table>
        <thead>
            <tr>
                <th colspan="3">
                    <div class="action-bar">
                        <h2>Roster</h2>
                        {#if $page.data.permissions.edit}
                            <Button variant="secondary">Add Person</Button>
                        {/if}
                    </div>
                </th>
            </tr>
            <tr class="column-labels">
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
            </tr>
        </thead>
        <tbody>
            {#each people as person}
                <tr>
                    <td>{person.name}</td>
                    <td>{person.email}</td>
                    <td>{person.role}</td>
                </tr>
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
        top: 65px;
        border-top: 2px solid var(--secondary-container);
        background-color: var(--background);
    }

    th, td {
        padding: 8px;
        text-align: left;
    }

    tr {
        border-bottom: 2px solid var(--secondary-container);
    }

    td {
        max-lines: 1;
    }

    tr:not(thead tr):hover {
        background-color: var(--light-gray);
    }

    th {
        color: var(--on-background);
        font-weight: normal;
    }

    .column-labels {
        background-color: var(--secondary-container);
    }
</style>

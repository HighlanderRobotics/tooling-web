<script>
    import RosterThumbnail from "$lib/assets/images/tool-thumbnails/RosterThumbnail.svelte";
</script>

<svelte:head>
    <title>Tools | Tooling</title>
</svelte:head>

<div class="tools">
    <a href="/tools/roster">
        <div class="card">
            <RosterThumbnail />
            <div class="text">
                <h1>Roster</h1>
                <p>View people associated with the team and manage their information.</p>
            </div>
        </div>
    </a>
</div>

<style>
    .tools {
        display: grid;
        grid-template-columns: repeat(auto-fit, 234px);
        grid-gap: 26px;
        justify-content: center;
        padding: 26px;
        margin: 0 auto;
        max-width: 1200px;
    }

    a {
        text-decoration: none;
    }

    .card {
        max-width: 234px;
        border-radius: 7px;
        background-color: var(--secondary-container);
        overflow: hidden;
        transition: background-color 150ms;
    }

    .card:hover {
        background-color: var(--light-gray);
    }

    h1 {
        font-size: 20px;
        font-style: normal;
        font-weight: 500;
        line-height: 32px;
    }

    p {
        color: var(--body);
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
    }

    .text {
        padding: 10px;
    }
</style>
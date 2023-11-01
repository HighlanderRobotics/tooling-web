<script>
    import { page } from "$app/stores";
	import { Button } from "magnolia-ui-svelte";
</script>

<div class="wrapper">
    <div class="content">
        <h1>Error {$page.status}</h1>
        <p>{$page.error?.message}</p>
        <Button element="a" href="/">Go home</Button>
    </div>
    <div class="footer">
        <p>Copyright © 2023 Highlander Robotics</p>
    </div>
</div>

<style>
    p {
        margin-bottom: 10px;
        color: var(--body);
    }

    .wrapper {
        display: grid;
        place-items: center;

        height: 100vh;
    }

    .content {
        background-color: var(--secondary-container);
        padding: 15px;
        border-radius: 7px;

        margin: 15px;
    }

    .footer {
        position: absolute;
        bottom: 5px;
        text-align: center;
        width: 100%;
    }

    @media only screen and (max-width: 450px) {
        .content {
            background-color: transparent;
        }
    }
</style>

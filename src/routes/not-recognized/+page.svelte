<script>
    import { signOut } from '@auth/sveltekit/client'
	import { Button } from 'magnolia-ui-svelte';

    import { page } from '$app/stores';
</script>

<svelte:head>
    <title>Account not recognized | Tooling</title>
</svelte:head>

<div class="wrapper">
    <div class="content">
        <h1>Nice to meet you!</h1>
        <p>We don't recognize the email address <b>{$page.data.session?.user?.email}</b>.</p>
        <p>Try using a different email. If you need help, ask someone with access which email to use.</p>
        <Button on:click={() => signOut()}>Sign out</Button>
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
        max-width: 500px;

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

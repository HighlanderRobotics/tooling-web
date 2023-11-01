<script>
	import { Button, DensityProvider, Icon, MenuWrapper, Menu, MenuItem, MenuButton } from "magnolia-ui-svelte";
	import Logo from "./Logo.svelte";
	import { page } from "$app/stores";
	import { signOut } from "@auth/sveltekit/client";

    let menuOpen = false;
</script>
<nav>
    <a class="home-link" href="/">
        <Logo />
        <h1 class="main-title">Tooling</h1>
    </a>

    <MenuWrapper>
        <button class="profile" on:click={() => menuOpen = true}>
            <img src={$page.data.session?.user?.image} alt="Profile image for {$page.data.session?.user?.name}">
        </button>
        <Menu bind:open={menuOpen} anchor="right">
            <MenuItem>Hi, {$page.data.session?.user?.name}</MenuItem>
            <MenuButton on:click={() => signOut()}>Sign out</MenuButton>
        </Menu>
    </MenuWrapper>
    <!-- <button on:click={() => signOut()}>out</button> -->
</nav>

<style>
    nav {
        display: flex;
        width: 100%;
        justify-content: space-between;
        align-items: center;
        position: sticky;
        top: 0;
        left: 0;
        right: 0;
        z-index: 50;

        padding: 16px;

        background-color: var(--background);
        height: 65px;
    }

    .home-link {
        display: flex;
        align-items: center;
        text-decoration: none;
    }

    .main-title {
        color: var(--victory-purple);
        font-size: 28px;
        font-style: normal;
        line-height: normal;
        font-weight: 500;

        margin-left: 8px;
    }

    /* --on-background in dark mode */
    @media (prefers-color-scheme: dark) {
        .main-title {
            color: var(--on-background);
        }
    }

    :global(.color-scheme-dark .main-title) {
        color: var(--on-background);
    }

    .profile {
        appearance: none;
        border: none;
        background: transparent;
        cursor: pointer;
    }

    .profile img {
        width: 44px;
        height: 44px;
        border-radius: 50%;
    }
</style>
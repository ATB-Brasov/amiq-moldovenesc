<script>
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
    <link rel="icon" href={favicon} />
    <link
        rel="preload"
        href="/fonts/Syne-Bold.ttf"
        as="font"
        type="font/ttf"
    />

    <link
        rel="preload"
        href="/fonts/Syne-SemiBold.ttf"
        as="font"
        type="font/ttf"
    />

    <link
        rel="preload"
        href="/fonts/Syne-Medium.ttf"
        as="font"
        type="font/ttf"
    />

    <link
        rel="preload"
        href="/fonts/Syne-VariableFont_wght.ttf"
        as="font"
        type="font/ttf"
    />

    <link
        rel="preload"
        href="/fonts/Syne-ExtraBold.ttf"
        as="font"
        type="font/ttf"
    />

</svelte:head>
{@render children()}

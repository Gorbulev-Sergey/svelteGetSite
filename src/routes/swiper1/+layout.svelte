<script lang="ts">
	import { theme, type Theme } from '$lib/scripts/store';
	import { onMount } from 'svelte';

	onMount(() => {
		let my_theme = localStorage.getItem('theme') ?? localStorage.setItem('theme', 'light');
		$theme = my_theme as Theme;
	});
</script>

<slot />

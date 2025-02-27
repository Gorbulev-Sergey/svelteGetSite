<script lang="ts">
	import { onMount } from 'svelte';

	let ukazania = $state('');

	onMount(async () => {
		ukazania = (await (await fetch('https://api.patriarchia.ru/v1/events/2025-01-02')).json())
			.content;
	});
</script>

{@html ukazania}

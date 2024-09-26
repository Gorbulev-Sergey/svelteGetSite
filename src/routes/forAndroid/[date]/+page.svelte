<script lang="ts">
	import { page } from '$app/stores';
	import Container from '$lib/Container.svelte';

	export let date: string = new Date().toISOString().slice(0, 10);
	$: url = `http://www.patriarchia.ru/bu/${$page.params.date ?? date}/print.html`;
	$: getSite = async () => {
		let result = await fetch('/api/url', {
			method: 'POST',
			body: JSON.stringify({ url: url })
		});

		return new DOMParser().parseFromString(await result.text(), 'text/html').querySelector('.main')
			?.innerHTML;
	};
</script>

<svelte:head>
	<title>Богослужебные указания</title>
</svelte:head>

{#await getSite() then result}
	<Container>
		<div class="bg-white text-dark" style="font-size:1.2em; line-height: 1.4em; font-weight: 400;">
			{@html result}
		</div>
	</Container>
{/await}

<style>
	:global(h1:first-of-type) {
		display: none;
	}
	:global(br:first-of-type) {
		display: none;
	}
</style>

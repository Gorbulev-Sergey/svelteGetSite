<script lang="ts">
	import Container from '$lib/Container.svelte';

	let date: string = new Date().toISOString().slice(0, 10);
	$: prevDate = () => {
		let date1 = new Date(date);
		date1.setTime(date1.getTime() - 24 * 60 * 60 * 1000);
		return date1.toISOString().slice(0, 10);
	};
	$: nextDate = () => {
		let date1 = new Date(date);
		date1.setTime(date1.getTime() + 24 * 60 * 60 * 1000);
		return date1.toISOString().slice(0, 10);
	};
	$: url = `http://www.patriarchia.ru/bu/${date}/print.html`;
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

<div class="sticky-top bg-success-subtle text-dark">
	<div class="container">
		<div class="d-flex flex-wrap align-items-center justify-content-center gap-1 px-1 py-2 py-md-3">
			<div class="d-flex align-items-center gap-2 mb-1 mb-md-0">
				<b class="flex-grow-1 mb-0 text-nowrap">Выбрать дату:</b>
			</div>
			<div class="d-flex align-items-center gap-1">
				<a
					href="/"
					title="Предыдущий день"
					class="btn btn-light"
					on:click={() => (date = prevDate())}><i class="fa-solid fa-arrow-left"></i></a
				>
				<input class="form-control border-0 bg-light" type="date" bind:value={date} />
				<a
					href="/"
					title="Следующий день"
					class="btn btn-light"
					on:click={() => (date = nextDate())}><i class="fa-solid fa-arrow-right"></i></a
				>
				<a
					href="/"
					title="Сегодня"
					class="btn btn-light"
					on:click={() => (date = new Date().toISOString().slice(0, 10))}>Сегодня</a
				>
			</div>
		</div>
	</div>
</div>

{#await getSite() then result}
	<Container>
		<div style="font-size:1.2em; line-height: 1.4em; font-weight: 400;">
			{@html result?.replace('Богослужебные указания за', 'Богослужебные указания на')}
		</div>
	</Container>
{/await}

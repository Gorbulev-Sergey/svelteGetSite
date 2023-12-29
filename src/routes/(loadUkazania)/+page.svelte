<script lang="ts">
	let date: string = new Date().toISOString().slice(0, 10);
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

<div class="sticky-top bg-dark text-light">
	<div class="container">
		<div class="d-flex align-items-center gap-3 mb-2 px-1 py-2">
			<b class="flex-grow-1 mb-0 textLf yt pf xnj? c yfcnegf.obvb-dark-subtle text-nowrap"
				>Изменить дату</b
			>
			<div class="input-group">
				<input class="form-control border-0 bg-dark-subtle" type="date" bind:value={date} />
				<button
					class="btn btn-outline-light"
					on:click={() => (date = new Date().toISOString().slice(0, 10))}>Сегодня</button
				>
			</div>
		</div>
	</div>
</div>

{#await getSite() then result}
	<div
		class="container mt-4 mb-5 text-dark rounded"
		style="font-size:1.4em; line-height: 1.4em; font-weight: 400;"
	>
		{@html result?.replace('Богослужебные указания за', 'Богослужебные указания на')}
	</div>
{/await}

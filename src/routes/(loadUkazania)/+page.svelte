<script lang="ts">
	export let date: string = new Date().toISOString().slice(0, 10);
	$: dateOldStyle = new Date(new Date(date).getTime() - 13 * 24 * 60 * 60 * 1000);

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
		let dom = new DOMParser()
			.parseFromString(await result.text(), 'text/html')
			.querySelector('.main');
		dom?.querySelector('.main h1')?.remove();
		dom?.querySelector('.main br')?.remove();
		let oldTitle = dom?.querySelector('.main .section .ln-day-head p');
		oldTitle.innerHTML = oldTitle?.innerHTML.replace(`${new Date(dateOldStyle).getDate()}. `, '');
		return dom?.innerHTML;
	};

	let isNewStyle = true;
</script>

<svelte:head>
	<title>Богослужебные указания</title>
</svelte:head>

<div class="sticky-top w-100 bg-dark-subtle text-dark p-3 shadow shadow-sm">
	<div class="d-flex flex-column align-items-start align-items-md-center gap-0">
		<h4 class="mb-0">Богослужебные указания</h4>
		<div class="d-flex align-items-center gap-1">
			<div>
				{#if isNewStyle}
					{new Date(date).toLocaleDateString('ru-ru', {
						weekday: 'long',
						year: 'numeric',
						month: 'long',
						day: 'numeric'
					})}
				{:else}
					{new Date(date).toLocaleDateString('ru-ru', {
						weekday: 'long'
					})},
					{new Date(dateOldStyle).toLocaleDateString('ru-ru', {
						year: 'numeric',
						month: 'long',
						day: 'numeric'
					})}
				{/if}
			</div>
			<button class="btn btn-sm btn-light text-dark" on:click={() => (isNewStyle = !isNewStyle)}>
				<div>
					{isNewStyle ? 'новый стиль' : 'старый стиль'}
				</div>
			</button>
		</div>
	</div>
</div>

{#await getSite() then result}
	<div
		class="px-3 py-2 mb-4 pb-5 my-text-wrap"
		style="font-size:1.2em; line-height: 1.4em; font-weight: 400;"
	>
		{@html result?.replace('Богослужебные указания за', 'Богослужебные указания на')}
	</div>
{/await}

<div class="fixed-bottom w-100 bg-dark-subtle text-light">
	<div class="container">
		<div class="d-flex flex-wrap align-items-center justify-content-center gap-1 px-2 py-3">
			<div class="btn-group btn-group-lg">
				<button title="Назад" class="btn btn-light border-end" on:click={() => (date = prevDate())}>
					<div class="d-flex align-items-center gap-2">
						<i class="fa-solid fa-arrow-left"></i>
						<div>Назад</div>
					</div>
				</button>
				<input
					class="form-control form-control-lg border-0 bg-light rounded-0"
					type="date"
					title="Выбрать дату"
					bind:value={date}
				/>
				<button
					title="Вперёд"
					class="btn btn-light border-start"
					on:click={() => (date = nextDate())}
				>
					<div class="d-flex align-items-center gap-2">
						<i class="fa-solid fa-arrow-right"></i>
						<div>Вперёд</div>
					</div>
				</button>
			</div>
		</div>
	</div>
</div>

<style>
	.my-text-wrap {
		overflow-wrap: break-word;
	}
</style>

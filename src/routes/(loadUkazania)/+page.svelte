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
</script>

<svelte:head>
	<title>Богослужебные указания</title>
</svelte:head>

<div class="sticky-top w-100 bg-dark-subtle text-dark p-2 p-md-3">
	<div class="d-flex flex-column align-items-start align-items-md-center gap-0">
		<h4 class="mb-0">Богослужебные указания</h4>
		<div>
			{new Date(date).toLocaleDateString('ru-ru', {
				weekday: 'long',
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			})} (новый стиль)
		</div>
		<div>
			{new Date(dateOldStyle).toLocaleDateString('ru-ru', {
				weekday: 'long',
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			})} (старый стиль)
		</div>
	</div>
</div>

{#await getSite() then result}
	<div
		class="bg-white text-dark text-wrap p-2 mb-3 pb-5 p-md-3"
		style="font-size:1.2em; line-height: 1.4em; font-weight: 400;"
	>
		{@html result?.replace('Богослужебные указания за', 'Богослужебные указания на')}
	</div>
{/await}

<div class="fixed-bottom w-100 bg-dark-subtle text-light">
	<div class="container">
		<div class="d-flex flex-wrap align-items-center justify-content-center gap-1 px-1 py-2 py-md-3">
			<!-- <div class="d-flex align-items-center gap-2 mb-1 mb-md-0">
				<b class="flex-grow-1 mb-0 text-nowrap">Выбрать дату:</b>
			</div> -->
			<div class="d-flex align-items-strech gap-2">
				<button title="Назад" class="btn btn-light" on:click={() => (date = prevDate())}>
					<div class="d-flex align-items-center gap-1">
						<i class="fa-solid fa-arrow-left"></i>
						<div style="margin-bottom: .15em;">Назад</div>
					</div>
				</button>
				<input
					class="form-control border-0 bg-light"
					type="date"
					title="Выбрать дату"
					bind:value={date}
				/>
				<button title="Вперёд" class="btn btn-light" on:click={() => (date = nextDate())}>
					<div class="d-flex align-items-center gap-1">
						<i class="fa-solid fa-arrow-right"></i>
						<div style="margin-bottom: .15em;">Вперёд</div>
					</div>
				</button>
				<button
					hidden
					title="Сегодня"
					class="btn btn-light"
					on:click={() => (date = new Date().toISOString().slice(0, 10))}>Сегодня</button
				>
			</div>
		</div>
	</div>
</div>

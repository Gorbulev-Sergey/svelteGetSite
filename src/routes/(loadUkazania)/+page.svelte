<script lang="ts">
	let { date = new Date().toISOString().slice(0, 10) }: { date: string } = $props();
	let dateNewStyle = $derived(new Date(date));
	let dateOldStyle = $derived(new Date(new Date(date).setDate(new Date(date).getDate() - 13)));

	let prevDate = $derived.by(() => {
		let date1 = new Date(new Date(date).setDate(new Date(date).getDate() - 1));
		return date1.toISOString().slice(0, 10);
	});
	let nextDate = $derived.by(() => {
		let date1 = new Date(new Date(date).setDate(new Date(date).getDate() + 1));
		return date1.toISOString().slice(0, 10);
	});

	async function getSite() {
		let d = new Date(new Date(date).getTime() - 13 * 24 * 60 * 60 * 1000)
			.toISOString()
			.slice(0, 10);
		let ukazania = (await (await fetch(`https://api.patriarchia.ru/v1/events/${d}`)).json())
			.content;
		return ukazania.replace(`${new Date(d).getDate()}. `, '');
	}

	let isNewStyle = $state(true);
</script>

<svelte:head>
	<title>Богослужебные указания</title>
</svelte:head>

<div class="sticky-top w-100 my-primary-bg text-light p-3 shadow shadow-sm">
	<div class="d-flex flex-column align-items-start align-items-md-center gap-0">
		<h4 class="mb-1">Богослужебные указания</h4>
		<div
			class="d-flex align-items-center justify-content-between justify-content-md-center gap-1 w-100"
		>
			<div class="flex-grow-1 flex-md-grow-0">
				{#if isNewStyle}
					{dateNewStyle.toLocaleDateString('ru-ru', {
						weekday: 'short'
					})}.,
					{dateNewStyle.toLocaleDateString('ru-ru', {
						year: 'numeric',
						month: 'long',
						day: 'numeric'
					})}
				{:else}
					{dateNewStyle.toLocaleDateString('ru-ru', {
						weekday: 'short'
					})}.,
					{dateOldStyle.toLocaleDateString('ru-ru', {
						year: 'numeric',
						month: 'long',
						day: 'numeric'
					})}
				{/if}
			</div>
			<button
				class="btn btn-sm btn-light my-primary-light-bg text-light border-0"
				onclick={() => (isNewStyle = !isNewStyle)}
			>
				<div class="text-nowrap">
					{isNewStyle ? 'новый стиль' : 'старый стиль'}
				</div>
			</button>
		</div>
	</div>
</div>

{#await getSite() then result}
	<div
		class="px-3 pt-3 pb-5 mb-5 my-text-wrap"
		style="font-size:1.2em; line-height: 1.4em; font-weight: 400;"
	>
		{@html result?.replace('Богослужебные указания за', 'Богослужебные указания на')}
	</div>
{/await}

<div class="fixed-bottom w-100 my-primary-bg">
	<div class="container">
		<div class="d-flex justify-content-between align-items-center gap-2 px-1 py-3">
			<button
				title="Назад"
				class="btn btn-lg btn-light my-primary-light-bg text-light border-0 flex-grow-1"
				onclick={() => {
					date = prevDate;
				}}
			>
				<div class="d-flex align-items-center gap-2 px-3">
					<i class="fa-solid fa-arrow-left"></i>
					<!-- <div>Назад</div> -->
				</div>
			</button>
			<input
				class="form-control flex-grow-0 text-center border-0 bg-transparent text-light"
				type="date"
				title="Выбрать дату"
				bind:value={date}
			/>
			<button
				title="Вперёд"
				class="btn btn-lg btn-light my-primary-light-bg text-light border-0 flex-grow-1"
				onclick={() => (date = nextDate)}
			>
				<div class="d-flex align-items-center gap-2 px-3">
					<i class="fa-solid fa-arrow-right"></i>
					<!-- <div>Вперёд</div> -->
				</div>
			</button>
		</div>
	</div>
</div>

<style>
	.my-text-wrap {
		overflow-wrap: break-word;
	}
	.my-primary-bg {
		background-color: rgba(43, 37, 37, 1);
	}
	.my-primary-light-bg {
		background-color: #7b6868;
	}
</style>

<script lang="ts">
	import { onMount } from 'svelte';
	import Swiper from 'swiper';
	import { Manipulation } from 'swiper/modules';
	import 'swiper/css';

	let sw: Swiper;
	let slide = async (date: string) =>
		`<div class="swiper-slide px-4 py-3">${(await getSite(url(date)))?.replace(
			'Богослужебные указания за',
			'Богослужебные указания на'
		)}</div>`;

	let dates: string[];
	let firstDate: string, lastDate: string;

	let dateNow: string = new Date().toISOString().slice(0, 10);
	$: url = (date: string) => `http://www.patriarchia.ru/bu/${date}/print.html`;
	$: prevDate = (date: string) => {
		let date1 = new Date(date);
		date1.setTime(date1.getTime() - 24 * 60 * 60 * 1000);
		return date1.toISOString().slice(0, 10);
	};
	$: nextDate = (date: string) => {
		let date1 = new Date(date);
		date1.setTime(date1.getTime() + 24 * 60 * 60 * 1000);
		return date1.toISOString().slice(0, 10);
	};

	$: getSite = async (urlMy: string) => {
		let result = await fetch('/api/url', {
			method: 'POST',
			body: JSON.stringify({ url: urlMy })
		});
		return new DOMParser().parseFromString(await result.text(), 'text/html').querySelector('.main')
			?.innerHTML;
	};

	onMount(async () => {
		sw = new Swiper('.swiper', {
			modules: [Manipulation],
			autoHeight: true
		});
		sw.appendSlide(await slide(prevDate(dateNow)));
		sw.appendSlide(await slide(dateNow));
		sw.appendSlide(await slide(nextDate(dateNow)));
		sw.slideTo(1);
		firstDate = prevDate(dateNow);
		lastDate = nextDate(dateNow);
		sw.on('slideChange', async (e) => {
			if (sw.activeIndex == 0) {
				dateNow = firstDate;
				firstDate = prevDate(firstDate);
				sw.prependSlide(await slide(firstDate));
			} else if (sw.activeIndex == sw.slides.length - 1) {
				dateNow = lastDate;
				lastDate = nextDate(lastDate);
				sw.appendSlide(await slide(lastDate));
			} else {
			}
		});
	});
</script>

<svelte:head>
	<title>Богослужебные указания</title>
	<meta name="description" content={`Богослужебные указания на ${dateNow}`} />
</svelte:head>

<div class="sticky-top bg-success-subtle text-dark">
	<div class="container">
		<div
			class="d-flex flex-wrap align-items-stretch justify-content-center gap-1 px-1 py-2 py-md-3"
		>
			<div class="d-flex align-items-center gap-2 mb-1 mb-md-0">
				<b class="flex-grow-1 mb-0 text-nowrap">Выбрать дату:</b>
			</div>
			<div class="d-flex align-items-center gap-1">
				<a
					href="/"
					title="Предыдущий день"
					class="btn btn-light border-0"
					on:click={() => (dateNow = prevDate(dateNow))}><i class="fa-solid fa-arrow-left"></i></a
				>
				<input class="form-control border-0 bg-light" type="date" bind:value={dateNow} />
				<a
					href="/"
					title="Следующий день"
					class="btn btn-light border-0"
					on:click={() => (dateNow = nextDate(dateNow))}><i class="fa-solid fa-arrow-right"></i></a
				>
				<a
					href="/"
					title="Сегодня"
					class="btn btn-light border-0"
					on:click={() => (dateNow = new Date().toISOString().slice(0, 10))}>Сегодня</a
				>
			</div>
		</div>
	</div>
</div>

<div class="container swiper rounded-3 mt-0 mb-0 mb-md-5 bg-light text-dark">
	<div class="swiper-wrapper"></div>
</div>

<style>
	:global(.swiper-slide) {
		font-size: 1.15em;
		line-height: 1.4em;
		font-weight: 400;
	}
</style>

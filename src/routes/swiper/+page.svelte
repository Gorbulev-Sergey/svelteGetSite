<script lang="ts">
	import { onMount } from 'svelte';
	import Swiper from 'swiper';
	import 'swiper/css';

	let sw: Swiper;

	let date: string = new Date().toISOString().slice(0, 10);
	$: url = (dateMy: string) => `http://www.patriarchia.ru/bu/${dateMy}/print.html`;
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

	$: getSite = async (urlMy: string) => {
		let result = await fetch('/api/url', {
			method: 'POST',
			body: JSON.stringify({ url: urlMy })
		});
		return new DOMParser().parseFromString(await result.text(), 'text/html').querySelector('.main')
			?.innerHTML;
	};

	onMount(() => {
		sw = new Swiper('.swiper', {
			initialSlide: 1
		});
		sw.slides.length = 3;
		sw.on('slideChange', (e) => {
			if (e.activeIndex == 0) {
				//date = prevDate();
			} else if (e.activeIndex == 2) {
				//date = nextDate();
				console.log(sw.slides.length);
				sw.addSlide(4, '<div class="swiper-slide">Slide 10"</div>');
			}
		});
	});
</script>

<div class="container swiper rounded-3 mt-3 bg-dark text-light">
	<div class="swiper-wrapper">
		<!-- Slides -->
		{#each new Array(sw?.slides.length) as item, i}
			<div class="swiper-slide d-flex flex-column gap-3 p-3">
				{#await getSite(i < 1 ? url(prevDate()) : i > 1 ? url(nextDate()) : url(date)) then result}
					{@html result}
				{/await}
			</div>
		{/each}
	</div>
</div>

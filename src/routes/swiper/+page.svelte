<script lang="ts">
	import { onMount } from 'svelte';
	import Swiper from 'swiper';
	import { Manipulation } from 'swiper/modules';
	import 'swiper/css';

	let sw: Swiper;
	let slide = async (date: string) =>
		`<div class="swiper-slide px-4 py-3">${await getSite(url(date))}</div>`;

	let date: string = new Date().toISOString().slice(0, 10);
	$: url = (date: string) => `http://www.patriarchia.ru/bu/${date}/print.html`;
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

	onMount(async () => {
		sw = new Swiper('.swiper', {
			modules: [Manipulation],
			autoHeight: true
		});
		sw.appendSlide(await slide(prevDate()));
		sw.appendSlide(await slide(date));
		sw.appendSlide(await slide(nextDate()));
		sw.slideTo(1);
		sw.on('slideChange', async (e) => {
			if (sw.activeIndex == 0) {
				sw.prependSlide(await slide(date));
			} else if (sw.activeIndex == sw.slides.length - 1) {
				sw.appendSlide(await slide(date));
			}
		});
	});
</script>

<div class="container swiper rounded-3 mt-3 bg-light text-dark">
	<div class="swiper-wrapper"></div>
</div>

<style>
	.swiper {
		min-height: 90vh;
	}
</style>

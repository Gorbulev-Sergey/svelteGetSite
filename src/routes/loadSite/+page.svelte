<script lang="ts">
	let url: string = 'http://www.patriarchia.ru/bu/2023-12-17/print.html';
	let site: HTMLElement;
	let siteString: string = '';
</script>

<h2>Данные сайта</h2>
<div class="form-floating mb-2">
	<input id="form_url" class="form-control" bind:value={url} />
	<label for="form_url">Url сайта</label>
</div>
<button
	class="btn btn-dark text-light mb-3"
	on:click={async () => {
		if (url.includes('http')) {
			let result = await fetch('/api/url', {
				method: 'POST',
				body: JSON.stringify({ url: url })
			});
			site =
				new DOMParser().parseFromString(await result.text(), 'text/html').querySelector('.main') ??
				new HTMLElement();
			siteString = site.innerHTML;
		}
	}}>Получить данные сайта</button
>

{#if siteString != ''}
	<div class="text-dark p-3 border rounded">
		{@html siteString}
	</div>
{/if}

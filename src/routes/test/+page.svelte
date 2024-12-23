<script lang="ts">
	export function setColor() {
		let e = document.querySelector('#text');
		e.style.backgroundColor = 'blue';
	}
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div id="text" on:click={() => setColor()}>Привет</div>

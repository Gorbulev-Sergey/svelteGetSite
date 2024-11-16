<script lang="ts">
	let { children } = $props();
</script>

<div class="bg-white container p-4 mt-1 mb-0 mb-md-5 rounded-3">
	{@render children?.()}
</div>

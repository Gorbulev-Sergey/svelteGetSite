<script lang="ts">
	export let message: string = 'Привет';

	export let setMessage = (m: string) => {
		message = m;
	};
</script>

<h1 class="text-light m-5">{message}</h1>

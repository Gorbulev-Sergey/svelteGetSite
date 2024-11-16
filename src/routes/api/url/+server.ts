export async function POST({ request, fetch }) {
	let { url } = await request.json();
	let result = await fetch(url, {
		method: 'GET',
		headers: {
			'Content-Type': 'text/html; charset=utf-8'
		}
	});
	return new Response(await result.text());
}

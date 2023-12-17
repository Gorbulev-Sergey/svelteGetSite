import { json } from '@sveltejs/kit';

export async function POST({ request }) {
	let { url } = await request.json();
	let result = await fetch(url, {
		method: 'GET',
		headers: {
			'Content-Type': 'text/html; charset=utf-8'
		}
	});
	return new Response(await result.text());
}

export async function POST({ request, fetch }) {
	let { date } = await request.json();
	let url = `https://api.patriarchia.ru/v1/events/${date}`;
	let result = await fetch(url, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json; charset=utf-8',
			'Access-Control-Allow-Origin': '*'
		}
	});
	console.log(result.json());
	return new Response(await result.text());
}

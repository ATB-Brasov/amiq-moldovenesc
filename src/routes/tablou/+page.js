import { echipe, intrebari } from '$lib/db.js'

/** @type {import('./$types').PageLoad} */
export function load({ params }) {
	return { echipe, intrebari };
}

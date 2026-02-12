import { x } from "$lib/db.js";

/** @type {import('./$types').PageServerLoad} */
export async function load() {
    return { counter: x.counter };
}

/** @satisfies {import('./$types').Actions} */
export const actions = {
    default: async ({locals}) => {
        x.emitter.dispatchEvent(new Event("message"))
        x.counter += 1;
        return { success: true };
    }
}

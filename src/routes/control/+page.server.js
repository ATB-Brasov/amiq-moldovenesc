import { x } from "$lib/db.js";

/** @type {import('./$types').PageServerLoad} */
export async function load() {
    return { counter: x.counter };
}

/** @satisfies {import('./$types').Actions} */
export const actions = {
    corect: async ({}) => {
        x.event_type = "corect";
        x.emitter.dispatchEvent(new Event("control"));
        return { success: true };
    },
    necorect: async ({}) => {
        x.event_type = "necorect";
        x.emitter.dispatchEvent(new Event("control"))
        return { success: true };
    },
    decrement: async ({}) => {
        x.event_type = "contor";
        x.counter -= 1;
        x.emitter.dispatchEvent(new Event("control"))
        return { success: true };
    },
    increment: async ({}) => {
        x.event_type = "contor";
        x.counter += 1;
        x.emitter.dispatchEvent(new Event("control"))
        return { success: true };
    }
}

// src/routes/custom-event/+server.js
import { pEvent } from "p-event";
import { produce } from 'sveltekit-sse';
import { x } from '$lib/db.js';

export function POST() {
    return produce(async function start({ emit }) {
        while (true) {
            const {error} = emit('counter', `${x.counter}`)
            if(error) {
                return
            }
            const event = await pEvent(x.emitter, "message")
            console.log(event)
        }
    })
}

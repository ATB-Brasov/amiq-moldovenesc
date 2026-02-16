// src/routes/custom-event/+server.js
import { pEvent } from "p-event";
import { produce } from 'sveltekit-sse';
import { x } from '$lib/db.js';

export function POST() {
    return produce(async function start({ emit }) {
        while (true) {

            if (x.event_type === 'contor') {

                const {error} = emit('counter', `${x.counter}`)
                if(error) {
                    console.log(error)
                    return
                }
                const {error: error2} = emit('raspuns', `...`)
                if(error2) {
                    console.log(error2)
                    return
                }

            } else if (x.event_type === "necorect") {

                const {error} = emit('raspuns', `necorect`)
                if(error) {
                    console.log(error)
                    return
                }

            } else if (x.event_type === "corect") {

                const {error} = emit('raspuns', `corect`)
                if(error) {
                    console.log(error)
                    return
                }

            }
            // x.event_type = ""

            const event = await pEvent(x.emitter, "control")
            console.log("x.event_type", x.event_type)

        }
    })
}

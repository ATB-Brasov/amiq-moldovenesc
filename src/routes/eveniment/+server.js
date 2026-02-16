// src/routes/custom-event/+server.js
import { pEvent } from "p-event";
import { produce } from 'sveltekit-sse';
import { x, echipe, intrebari} from '$lib/db.js';

export function POST() {
    return produce(async function start({ emit }) {


        {
            const punctaj = echipe[0].puncte
            const {error} = emit(`puncte1`, punctaj.toString())
            if(error) {
                console.log(error)
                return
            }
        }
        {
            const punctaj = echipe[1].puncte
            const {error} = emit(`puncte2`, punctaj.toString())
            if(error) {
                console.log(error)
                return
            }
        }

        while (true) {

            if (x.event_type.startsWith('apasat-')) {

                const found = x.event_type.match(/apasat-(\d)/)
                if (found === null) {
                    console.error("Why is found null? It cannot be null!!!!")
                    continue
                }
                console.log(found[1])

                const {error} = emit('apasat', found[1])
                if(error) {
                    console.log(error)
                    return
                }

            } else if (x.event_type === 'reseteaza-respondent') {
                const {error} = emit('apasat', "0")
                if(error) {
                    console.log(error)
                    return
                }
            } else if (x.event_type === 'contor') {

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
                const {error: error3} = emit('apasat', "0")
                if(error3) {
                    console.log(error3)
                    return
                }


            } else if (x.event_type === "gresit") {

                const {error} = emit('raspuns', 'gresit')
                if(error) {
                    console.log(error)
                    return
                }

            } else if (x.event_type === "corect") {

                if (x.echipa_activa !== 0) {
                    const {error} = emit('raspuns', `corect`)
                    if(error) {
                        console.log(error)
                        return
                    }

                    echipe[x.echipa_activa - 1].puncte += intrebari[x.counter].puncte
                    const punctaj = echipe[x.echipa_activa - 1].puncte
                    const {error: error2} = emit(`puncte${x.echipa_activa}`, punctaj.toString())
                    if(error2) {
                        console.log(error2)
                        return
                    }
                }

            }
            // x.event_type = ""

            const event = await pEvent(x.emitter, "control")
            console.log("x.event_type", x.event_type)

        }
    })
}

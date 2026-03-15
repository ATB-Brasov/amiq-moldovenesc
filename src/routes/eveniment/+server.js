// src/routes/custom-event/+server.js
import { pEvent } from "p-event";
import { produce } from "sveltekit-sse";
import { x, echipe } from "$lib/db.js";

export function POST() {
    return produce(async function start({ emit }) {


        while (true) {

            if (x.event_type.startsWith("apasat-")) {

                const found = x.event_type.match(/apasat-(\d)/)
                if (found === null) {
                    console.error("Why is found null? It cannot be null!!!!")
                    continue
                }
                console.log(found[1])

                const {error} = emit("apasat", found[1])
                if(error) {
                    console.log(error)
                    return
                }

                const {error: error2} = emit("raspuns", "")
                if(error2) {
                    console.log(error2)
                    return
                }

            } else if (x.event_type === "reseteaza-respondent") {
                const {error} = emit("apasat", "0")
                if(error) {
                    console.log(error)
                    return
                }
                const {error: error2} = emit("raspuns", "")
                if(error2) {
                    console.log(error2)
                    return
                }
            } else if (x.event_type === "reseteaza-joc") {
                const {error} = emit("apasat", "0")
                if(error) {
                    console.log(error)
                    return
                }
                const {error: error2} = emit("raspuns", "")
                if(error2) {
                    console.log(error2)
                    return
                }
                let resp = emit('puncte1', '0')
                if(resp.error) {
                    console.log(resp.error)
                    return
                }
                resp = emit('puncte2', '0')
                if(resp.error) {
                    console.log(resp.error)
                    return
                }
            } else if (x.event_type === "nr_intrebare") {

                const {error} = emit("nr_intrebare", x.joc.întrebarea.toString())
                if(error) {
                    console.log(error)
                    return
                }
                const {error: error2} = emit("raspuns", "")
                if(error2) {
                    console.log(error2)
                    return
                }
                const {error: error3} = emit("apasat", "0")
                if(error3) {
                    console.log(error3)
                    return
                }


            } else if (x.event_type === "gresit") {

                const {error} = emit("raspuns", "gresit")
                if(error) {
                    console.log(error)
                    return
                }

            } else if (x.event_type === "corect") {

                if (x.joc.ekipa !== 0) {
                    const {error} = emit("raspuns", "corect")
                    if(error) {
                        console.log(error)
                        return
                    }

                    const punctaj = echipe[x.joc.ekipa - 1].puncte
                    const {error: error2} = emit(`puncte${x.joc.ekipa}`, punctaj.toString())
                    if(error2) {
                        console.log(error2)
                        return
                    }
                }

            }
            // x.event_type = ""

            const {error} = emit("timp", x.joc.timp.toString())
            if(error) {
                console.log(error)
                return
            }

            const event = await pEvent(x.emitter, "control")
            if (x.event_type !== "xronox") {
                console.log("x.event_type", x.event_type)
            }

        }
    })
}

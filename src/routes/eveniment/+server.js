// src/routes/custom-event/+server.js
import { pEvent } from "p-event";
import { produce } from "sveltekit-sse";
import { x, ekipe, probe } from "$lib/db.js";

function supraemit(emit) {
    return (nume, data) => {
        resp = emit(nume, data)
        if (resp.error) {
            console.log(resp.error)
            return false
        }
        return true
    }
}

export function POST() {
    return produce(async function start({ emit }) {
        const emitor = supraemit(emit)

        while (true) {
            let resp;
            let ok;

            if (x.event_type.startsWith("apasat-")) {
                const found = x.event_type.match(/apasat-(\d)/)
                if (found === null) {
                    console.error("Why is found null? It cannot be null!!!!")
                    continue
                }

                resp = emit("apasat", found[1])
                if (resp.error) {
                    console.log(resp.error)
                    return
                }
                resp = emit("raspuns", "")
                if (resp.error) {
                    console.log(resp.error)
                    return
                }

            } else if (x.event_type === "reseteaza-respondent") {
                resp = emit("apasat", "0")
                if (resp.error) {
                    console.log(resp.error)
                    return
                }
                resp = emit("raspuns", "")
                if (resp.error) {
                    console.log(resp.error)
                    return
                }

            } else if (x.event_type === "reseteaza-joc") {
                resp = emit("apasat", "0")
                if (resp.error) {
                    console.log(resp.error)
                    return
                }
                resp = emit("raspuns", "")
                if (resp.error) {
                    console.log(resp.error)
                    return
                }
                resp = emit('puncte1', '0')
                if (resp.error) {
                    console.log(resp.error)
                    return
                }
                resp = emit('puncte2', '0')
                if (resp.error) {
                    console.log(resp.error)
                    return
                }

            } else if (x.event_type === "nr_intrebare") {
                resp = emit("nr_intrebare", x.joc.proba.toString())
                if (resp.error) {
                    console.log(resp.error)
                    return
                }
                resp = emit("raspuns", "")
                if (resp.error) {
                    console.log(resp.error)
                    return
                }
                resp = emit("apasat", "0")
                if (resp.error) {
                    console.log(resp.error)
                    return
                }
                resp = emit("puncte", probe[x.joc.proba].puncte.toString())
                if (resp.error) {
                    console.log(resp.error)
                    return
                }


            } else if (x.event_type === "puncte") {
                resp = emit("puncte", probe[x.joc.proba].puncte.toString())
                if (resp.error) {
                    console.log(resp.error)
                    return
                }

            } else if (x.event_type === "arata-raspuns") {
                resp = emit("raspuns", "arata-raspuns")
                if (resp.error) {
                    console.log(resp.error)
                    return
                }

            } else if (x.event_type === "gresit") {
                resp = emit("raspuns", "gresit")
                if (resp.error) {
                    console.log(resp.error)
                    return
                }

            } else if (x.event_type === "corect") {
                if (x.joc.ekipa !== 0) {
                    resp = emit("raspuns", "corect")
                    if (resp.error) {
                        console.log(resp.error)
                        return
                    }
                    const punctaj = ekipe[x.joc.ekipa - 1].puncte
                    resp = emit(`puncte${x.joc.ekipa}`, punctaj.toString())
                    if (resp.error) {
                        console.log(resp.error)
                        return
                    }
                }
            }

            resp = emit("timp", x.joc.timp.toString())
            if (resp.error) {
                console.log(error)
                return
            }

            await pEvent(x.emitter, "control")
            if (x.event_type !== "xronox") {
                console.log("x.event_type", x.event_type)
            }

        }
    })
}

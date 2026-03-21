// src/routes/custom-event/+server.js
import { pEvent } from "p-event";
import { produce } from "sveltekit-sse";
import { x, ekipe, probe } from "$lib/db.js";

function supraemit(emit) {
    return (nume, data) => {
        const resp = emit(nume, data)
        if (resp.error) {
            console.error(`emitor: ${nume}:`, resp.error)
            return false
        }
        return true
    }
}

export function POST() {
    return produce(async function start({ emit }) {
        const emitor = supraemit(emit)

        while (true) {
            let ok = true;

            if (x.event_type === "apasat") {
                ok &&= emitor("apasat", x.event_data)
                ok &&= emitor("raspuns", "")

            } else if (x.event_type === "reseteaza-respondent") {
                ok &&= emitor("apasat", "0")
                ok &&= emitor("raspuns", "")

            } else if (x.event_type === "reseteaza-joc") {
                ok &&= emitor("nr_intrebare", x.joc.proba.toString())
                ok &&= emitor("raspuns", "")
                ok &&= emitor("apasat", "0")
                ok &&= emitor('puncte1', '0')
                ok &&= emitor('puncte2', '0')
                ok &&= emitor("puncte", probe[x.joc.proba].puncte.toString())

            } else if (x.event_type === "nr_intrebare") {
                ok &&= emitor("nr_intrebare", x.joc.proba.toString())
                ok &&= emitor("raspuns", "")
                ok &&= emitor("apasat", "0")
                ok &&= emitor("puncte", probe[x.joc.proba].puncte.toString())


            } else if (x.event_type === "puncte") {
                ok &&= emitor("puncte", probe[x.joc.proba].puncte.toString())

            } else if (x.event_type === "arata-raspuns") {
                ok &&= emitor("raspuns", "arata-raspuns")

            } else if (x.event_type === "gresit") {
                ok &&= emitor("raspuns", "gresit")

            } else if (x.event_type === "corect") {
                if (x.joc.ekipa !== 0) {
                    ok &&= emitor("raspuns", "corect")
                    const punctaj = ekipe[x.joc.ekipa - 1].puncte
                    ok &&= emitor(`puncte${x.joc.ekipa}`, punctaj.toString())
                }
            }

            ok &&= emitor("timp", x.joc.timp.toString())
            if (!ok) return

            await pEvent(x.emitter, "control")
            if (x.event_type !== "xronox") {
                console.log("x.event_type", x.event_type)
            }
        }
    })
}

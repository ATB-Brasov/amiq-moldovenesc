// src/routes/eveniment/+server.js
import { x } from '$lib/db.js';
import { pEvent } from 'p-event';
import { produce } from 'sveltekit-sse';

export const POST = () =>
    produce(async function start({ emit }) {
        function supraemit(/**@type{string}*/ nume, /**@type{any}*/ data) {
            const { error } = emit(nume, data.toString());
            if (error) {
                console.error(`emitor: ${nume}:`, error);
                return false;
            }
            return true;
        }
        while (x.evente.reduce((ok, [k, v]) => ok && supraemit(k, v), true)) {
            await pEvent(x.emitter, 'control');
        }
    });

import { Database } from "bun:sqlite";

export const db = new Database(":memory:");

export const x = {
    counter: 0,
    emitter: new EventTarget(),
}

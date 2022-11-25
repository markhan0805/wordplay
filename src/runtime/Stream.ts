import type Translations from "../nodes/Translations";
import { STREAM_NATIVE_TYPE_NAME } from "../nodes/StreamType";
import None from "./None";
import Primitive from "./Primitive";
import type Value from "./Value";
import type LanguageCode from "../nodes/LanguageCode";
import Names from "../nodes/Names";
import Docs from "../nodes/Docs";
import type Node from "../nodes/Node";

const HISTORY_LIMIT = 256;

export default abstract class Stream extends Primitive {

    /** Documentation on this stream */
    docs: Docs;

    /** The names of this stream */
    names: Names;

    /** The stream of values */
    values: Value[] = [];

    /** Listeners watching this stream */
    reactors: ((stream: Stream)=>void)[] = [];

    constructor(creator: Node, docs: Docs | Translations, names: Names | Translations, initalValue: Value) {
        super(creator);

        this.docs = docs instanceof Docs ? docs : new Docs(docs);
        this.names = names instanceof Names ? names : new Names(names);
        this.add(initalValue);
    }
    
    getDescriptions(): Translations { return this.docs.getTranslations(); }

    getNames() { return this.names.getNames(); }
    getTranslation(languages: LanguageCode[]): string { return this.names.getTranslation(languages); }

    hasName(name: string) { return this.names.hasName(name); }

    isEqualTo(value: Value): boolean {
        return value === this;
    }

    add(value: Value) {

        // Update the time.
        this.values.push(value);

        // Limit the array to 1000 values to avoid leaking memory.
        const oldest = Math.max(0, this.values.length - HISTORY_LIMIT);
        this.values = this.values.slice(oldest, oldest + HISTORY_LIMIT);

        // Notify subscribers of the state change.
        this.notify();

    }

    getNativeTypeName(): string { return STREAM_NATIVE_TYPE_NAME; }

    latest() { return this.values[this.values.length - 1]; }

    at(requestor: Node, index: number): Value {

        const position = this.values.length - index - 1;
        return position >= 0 && position < this.values.length ? this.values[position] : new None(requestor);

    }

    listen(listener: (stream: Stream)=>void) {
        this.reactors.push(listener);
    }

    ignore(listener: (stream: Stream)=> void) {
        this.reactors = this.reactors.filter(l => l !== listener);
    }

    notify() {
        // Tell each reactor that this stream changed.
        this.reactors.forEach(reactor => reactor(this));
    }

    /** Should produce valid Wordplay code string representing the stream's name */
    toString() { return this.names.getTranslation("😀"); };

    /** Should return named values on the stream. */
    resolve(): Value | undefined { return undefined; }

    /** Should start whatever is necessary to start listening to data stream. */
    abstract start(): void;

    /** Should do whatever cleanup is necessary to stop listening to a data stream */
    abstract stop(): void;

}
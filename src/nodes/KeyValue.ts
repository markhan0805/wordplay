import type Conflict from "../conflicts/Conflict";
import type Expression from "./Expression";
import Node, { type ConflictContext } from "./Node";
import type Token from "./Token";
import type Unparsable from "./Unparsable";

export default class KeyValue extends Node {

    readonly key: Expression | Unparsable;
    readonly bind: Token;
    readonly value: Expression | Unparsable;

    constructor(key: Expression | Unparsable, bind: Token, value: Expression | Unparsable) {
        super();

        this.key = key;
        this.bind = bind;
        this.value = value;
    }

    computeChildren() {
        return [ this.key, this.bind, this.value ];
    }

}
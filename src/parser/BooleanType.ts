import type Node from "./Node";
import type Conflict from "./Conflict";
import type Program from "./Program";
import type { Token } from "./Token";
import Type from "./Type";
import type Conversion from "./Conversion";

export default class BooleanType extends Type {

    readonly type?: Token;

    constructor(type?: Token) {
        super();

        this.type = type;
    }

    getChildren() {
        return this.type === undefined ? [] : [ this.type ];
    }

    getConflicts(program: Program): Conflict[] { return []; }

    isCompatible(program: Program, type: Type) { return type instanceof BooleanType; }

    getConversion(program: Program, type: Type): Conversion | undefined {
        // TODO Define conversions from booleans to other types
        // TODO Look for custom conversions that extend the Boolean type
        return undefined;
    }

}
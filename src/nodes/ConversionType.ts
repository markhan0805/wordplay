import type Conflict from "../conflicts/Conflict";
import type { ConflictContext } from "./Node";
import Type from "./Type";

export default class ConversionType extends Type {

    readonly output: Type;
    
    constructor(output: Type) {
        super();
        this.output = output;
    }

    computeChildren() { return [ this.output ]; }

    isCompatible(context: ConflictContext, type: Type): boolean {
        return type instanceof ConversionType && type.output.isCompatible(context, this.output);
    }

    getNativeTypeName(): string { return "conversion"; }

}
import Token from "./Token";
import Expression from "./Expression";
import NoneType from "./NoneType";
import type Type from "./Type";
import type Node from "./Node";
import None from "../runtime/None";
import type Value from "../runtime/Value";
import Finish from "../runtime/Finish";
import type Step from "../runtime/Step";
import Alias from "./Alias";

export default class NoneLiteral extends Expression {
    readonly none: Token;
    readonly aliases: Alias[];

    constructor(error: Token, aliases: Alias[]) {
        super();

        this.none = error;
        this.aliases = aliases;
    }

    computeChildren() { return [ this.none, ...this.aliases ]; }
    computeConflicts() {}

    computeType(): Type {
        // Always of type none, with the optional name.
        return new NoneType(this.aliases, this.none);
    }

    compile(): Step[] {
        return [ new Finish(this) ];
    }

    evaluate(): Value {
        return new None(this.aliases);
    }

    clone(original?: Node, replacement?: Node) { 
        return new NoneLiteral(
            this.none.cloneOrReplace([ Token ], original, replacement), 
            this.aliases.map(a => a.cloneOrReplace([ Alias ], original, replacement))
        ) as this; 
    }

}
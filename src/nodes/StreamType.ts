import { STREAM_SYMBOL } from "../parser/Tokenizer";
import AnyType from "./AnyType";
import type Context from "./Context";
import type Node from "./Node";
import Token from "./Token";
import TokenType from "./TokenType";
import Type from "./Type";
import Unparsable from "./Unparsable";

export const STREAM_NATIVE_TYPE_NAME = "stream";

export default class StreamType extends Type {

    readonly stream: Token;
    readonly type: Type | Unparsable;

    constructor(type: Type | Unparsable, stream?: Token) {
        super();

        this.stream = stream ?? new Token(STREAM_SYMBOL, [ TokenType.STREAM ]);
        this.type = type;
    }

    computeChildren() {
        return [ this.stream, this.type ];
    }
    computeConflicts() {}

    isCompatible(type: Type, context: Context): boolean {
        if(type instanceof AnyType) return true;
        return type instanceof StreamType && 
            this.type instanceof Type && 
            type.type instanceof Type && 
            this.type.isCompatible(type.type, context);
    }

    getNativeTypeName(): string { return STREAM_NATIVE_TYPE_NAME; }

    clone(original?: Node, replacement?: Node) { 
        return new StreamType(
            this.type.cloneOrReplace([ Type, Unparsable ], original, replacement), 
            this.stream.cloneOrReplace([ Token ], original, replacement)
        ) as this; 
    }

}
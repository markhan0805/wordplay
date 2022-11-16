import type Conflict from "../conflicts/Conflict";
import { IncompatibleKey } from "../conflicts/IncompatibleKey";
import Expression from "./Expression";
import Token from "./Token";
import Type from "./Type";
import type Node from "./Node";
import UnknownType from "./UnknownType";
import Unparsable from "./Unparsable";
import type Evaluator from "../runtime/Evaluator";
import type Value from "../runtime/Value";
import Set from "../runtime/Set";
import Map from "../runtime/Map";
import type Step from "../runtime/Step";
import Finish from "../runtime/Finish";
import Start from "../runtime/Start";
import type Context from "./Context";
import MapType from "./MapType";
import SetType from "./SetType";
import BooleanType from "./BooleanType";
import type Bind from "./Bind";
import type { TypeSet } from "./UnionType";
import TypeException from "../runtime/TypeException";
import UnionType from "./UnionType";
import { getExpressionReplacements, getPossiblePostfix } from "../transforms/getPossibleExpressions";
import AnyType from "./AnyType";
import type Transform from "../transforms/Transform"
import SetOpenToken from "./SetOpenToken";
import SetCloseToken from "./SetCloseToken";
import Replace from "../transforms/Replace";
import ExpressionPlaceholder from "./ExpressionPlaceholder";
import type Translations from "./Translations";
import { TRANSLATE } from "./Translations"
import { NotASetOrMap } from "../conflicts/NotASetOrMap";

export default class SetOrMapAccess extends Expression {

    readonly setOrMap: Expression | Unparsable;
    readonly open: Token;
    readonly key: Expression | Unparsable;
    readonly close: Token;

    constructor(setOrMap: Expression | Unparsable, key: Expression | Unparsable, open?: Token, close?: Token) {
        super();

        this.setOrMap = setOrMap;
        this.open = open === undefined ? new SetOpenToken() : open;
        this.key = key;
        this.close = close ?? new SetCloseToken();

        this.computeChildren();

    }

    getGrammar() { 
        return [
            { name: "setOrMap", types:[ Expression, Unparsable ] },
            { name: "open", types:[ Token ] },
            { name: "key", types:[ Expression, Unparsable ] },
            { name: "close", types:[ Token ] },
        ];
    }

    clone(pretty: boolean=false, original?: Node, replacement?: Node) { 
        return new SetOrMapAccess(
            this.cloneOrReplaceChild(pretty, "setOrMap", this.setOrMap, original, replacement), 
            this.cloneOrReplaceChild(pretty, "key", this.key, original, replacement), 
            this.cloneOrReplaceChild(pretty, "open", this.open, original, replacement),
            this.cloneOrReplaceChild(pretty, "close", this.close, original, replacement)
        ) as this; 
    }

    computeConflicts(context: Context): Conflict[] { 
    
        if(this.setOrMap instanceof Unparsable || this.key instanceof Unparsable) return [];

        const setMapType = this.setOrMap.getTypeUnlessCycle(context);
        const keyType = this.key.getTypeUnlessCycle(context);

        const conflicts = [];

        if(!(setMapType instanceof SetType || setMapType instanceof MapType))
            conflicts.push(new NotASetOrMap(this, setMapType));

        if((setMapType instanceof SetType || setMapType instanceof MapType) && setMapType.key instanceof Type && !setMapType.key.accepts(keyType, context))
            conflicts.push(new IncompatibleKey(this, setMapType.key, keyType));

        return conflicts;
    
    }

    computeType(context: Context): Type {
        // Either a set or map type, and if so, the key or value's type.
        if(this.setOrMap instanceof Unparsable) return new UnknownType(this.setOrMap);
        const setOrMapType = this.setOrMap.getTypeUnlessCycle(context);
        if(setOrMapType instanceof MapType && setOrMapType.value instanceof Type) return setOrMapType.value;
        else if(setOrMapType instanceof SetType) return new BooleanType();
        else return new UnknownType(this);
    }

    compile(context: Context):Step[] {
        // Evaluate the set expression, then the key expression, then this.
        return [ 
            new Start(this),
            ...this.setOrMap.compile(context),
            ...this.key.compile(context),
            new Finish(this)
        ];
    }

    evaluate(evaluator: Evaluator): Value {
        
        const key = evaluator.popValue(undefined);
        const setOrMap = evaluator.popValue(undefined);

        if(!(setOrMap instanceof Set || setOrMap instanceof Map)) 
            return new TypeException(evaluator, new UnionType(new SetType(), new MapType()), setOrMap);
        else return setOrMap.has(this, key);
    
    }

    evaluateTypeSet(bind: Bind, original: TypeSet, current: TypeSet, context: Context) { 
        if(this.setOrMap instanceof Expression) this.setOrMap.evaluateTypeSet(bind, original, current, context);
        if(this.key instanceof Expression) this.key.evaluateTypeSet(bind, original, current, context);
        return current;
    }

    getChildReplacement(child: Node, context: Context): Transform[] | undefined  {

        if(child === this.setOrMap) {
            return getExpressionReplacements(context.source, this, this.setOrMap, context, new UnionType(new SetType(new AnyType()), new MapType(new AnyType(), new AnyType())));
        }
        else if(child === this.key) {
            const setMapType = this.setOrMap.getTypeUnlessCycle(context);
            return getExpressionReplacements(context.source, this, this.key, context, 
                (setMapType instanceof SetType || setMapType instanceof MapType) && setMapType.key instanceof Type ? setMapType.key :
                new AnyType()
            )
        }

    }

    getInsertionBefore() { return undefined; }

    getInsertionAfter(context: Context): Transform[] | undefined { return getPossiblePostfix(context, this, this.getType(context)); }

    getChildRemoval(child: Node, context: Context): Transform | undefined {
        if(child === this.setOrMap || child === this.key) return new Replace(context.source, child, new ExpressionPlaceholder());
    }

    getStartExplanations(): Translations { 
        return {
            "😀": TRANSLATE,
            eng: "First evaluate the set/map, then the key."
        }
     }

    getFinishExplanations(): Translations {
        return {
            "😀": TRANSLATE,
            eng: "Then find the matching key in the set/map."
        }
    }

    getDescriptions(): Translations {
        return {
            "😀": TRANSLATE,
            eng: "Get a value in a set or a map"
        }
    }

    getChildPlaceholderLabel(child: Node): Translations | undefined {
        if(child === this.setOrMap) return {
            "😀": TRANSLATE,
            eng: "set/map"
        };
        else if(child === this.key) return {
            "😀": TRANSLATE,
            eng: "key"
        };
    }

}
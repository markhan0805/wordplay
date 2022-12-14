import Expression from "./Expression";
import TextType from "./TextType";
import Token from "./Token";
import type Type from "./Type";
import type Node from "./Node";
import type Evaluator from "../runtime/Evaluator";
import type Value from "../runtime/Value";
import Text from "../runtime/Text";
import Finish from "../runtime/Finish";
import type Step from "../runtime/Step";
import type Context from "./Context";
import Language from "./Language";
import type Bind from "./Bind";
import type { TypeSet } from "./UnionType";
import Start from "../runtime/Start";
import TokenType from "./TokenType";
import ExpressionPlaceholder from "./ExpressionPlaceholder";
import { getExpressionReplacements, getPossiblePostfix } from "../transforms/getPossibleExpressions";
import type Transform from "../transforms/Transform"
import { getPossibleLanguages } from "../transforms/getPossibleLanguages";
import Replace from "../transforms/Replace";
import Add from "../transforms/Add";
import Remove from "../transforms/Remove";
import type Translations from "./Translations";
import { TRANSLATE } from "./Translations"

export type TemplatePart = Expression | Token;

export default class Template extends Expression {
    
    readonly open: Token;
    readonly expressions: TemplatePart[];
    readonly format?: Language;

    constructor(open: Token, expressions: TemplatePart[], format?: Language) {
        super();

        this.open = open;
        this.expressions = expressions ?? [ new Token("'\\", TokenType.TEXT_OPEN), new ExpressionPlaceholder(), new Token("\\'", TokenType.TEXT_CLOSE )];
        this.format = format;

        this.computeChildren();

    }

    getGrammar() { 
        return [
            { name: "open", types:[ Token ] },
            { name: "expressions", types:[[ Expression, Token ]] },
            { name: "format", types:[ Language, undefined ] },
        ];
    }

    replace(original?: Node, replacement?: Node) { 
        return new Template(
            this.replaceChild("open", this.open, original, replacement),
            this.replaceChild("expressions", this.expressions, original, replacement),
            this.replaceChild("format", this.format, original, replacement)
        ) as this; 
    }

    computeConflicts() { return []; }

    computeType(): Type {
        return TextType.make(this.format);
    }

    getDependencies(): Expression[] {
        return [ ...this.expressions.filter((ex): ex is Expression => ex instanceof Expression) ];
    }

    compile(context: Context):Step[] {
        return [
            new Start(this),
            ...this.expressions.filter(p => p instanceof Expression).reduce(
                (parts: Step[], part) => [...parts, ...(part as Expression).compile(context)], []
            ),
            new Finish(this)
        ];
    }
    
    evaluate(evaluator: Evaluator, prior: Value | undefined): Value {
        
        if(prior) return prior;
        
        // Build the string in reverse, accounting for the reversed stack of values.
        let text = "";
        for(let i = this.expressions.length - 1; i >= 0; i--) {
            const p = this.expressions[i];
            const part = p instanceof Token ? new Text(this, p.text.toString().substring(1, p.text.toString().length - 1)) : evaluator.popValue(TextType.make());
            if(!(part instanceof Text)) return part;
            text = part.text + text;
        }
        text = this.open.text.toString().substring(1, this.open.text.toString().length - 1) + text;
        return new Text(this, text, this.format?.getLanguage());

    }

    evaluateTypeSet(bind: Bind, original: TypeSet, current: TypeSet, context: Context) { 
        this.expressions.forEach(part => { if(part instanceof Expression) part.evaluateTypeSet(bind, original, current, context); });
        return current;
    }

    getChildReplacement(child: Node, context: Context): Transform[] | undefined {
    
        const project = context.project;

        const index = this.expressions.indexOf(child as TemplatePart);
        if(index >= 0) {
            const part = this.expressions[index];
            if(part instanceof Expression)
                return getExpressionReplacements(this, part, context);
        }
        else if(child === this.format && project !== undefined)
            return getPossibleLanguages(project).map(l => new Replace(context, child, Language.make(l)));

    }
    
    getInsertionBefore() { return undefined; }
    
    getInsertionAfter(context: Context, position: number): Transform[] | undefined { 
        
        const project = context.project;

        return [
            ...getPossiblePostfix(context, this, this.getType(context)),
            ...(this.format === undefined && project !== undefined ? getPossibleLanguages(project).map(l => new Add(context, position, this, "format", Language.make(l))) : [])
        ];

    }

    getChildRemoval(child: Node, context: Context): Transform | undefined {
        if(this.expressions.includes(child as TemplatePart)) return new Remove(context, this, child);
        else if(child === this.format) return new Remove(context, this, child);
    }

    getDescriptions(): Translations {
        return {
            "😀": TRANSLATE,
            eng: "Text made of values"
        }
    }

    getStart() { return this.open; }
    getFinish() { return this.expressions[this.expressions.length - 1] ?? this.open; }

    getStartExplanations(): Translations { 
        return {
            "😀": TRANSLATE,
            eng: "Start by evaluating all of the parts in this template."
        }
     }

    getFinishExplanations(): Translations {
        return {
            "😀": TRANSLATE,
            eng: "Now make some text out of the parts!"
        }
    }

}
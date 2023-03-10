import Exception from './Exception';
import type Evaluator from './Evaluator';
import type Translation from '@translation/Translation';
import type Token from '@nodes/Token';
import Value from './Value';
import NodeLink from '@translation/NodeLink';
import ValueLink from '@translation/ValueLink';

export default class NameException extends Exception {
    readonly name: Token | undefined;
    readonly scope: Value | undefined;

    constructor(
        name: Token | undefined,
        scope: Value | undefined,
        evaluator: Evaluator
    ) {
        super(evaluator);

        this.name = name;
        this.scope = scope;
    }

    getDescription(translation: Translation) {
        return translation.exceptions.name(
            this.name
                ? new NodeLink(
                      this.name,
                      translation,
                      this.getNodeContext(this.name),
                      this.name.getText()
                  )
                : undefined,
            this.scope instanceof Value
                ? new ValueLink(
                      this.scope,
                      translation,
                      this.getNodeContext(this.scope.creator)
                  )
                : undefined
        );
    }
}

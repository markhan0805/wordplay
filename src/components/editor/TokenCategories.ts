import Sym from '@nodes/Symbol';

const TokenCategoryDelimiter = 'delimiter';
const TokenCategoryRelation = 'relation';
const TokenCategoryShare = 'share';
const TokenCategoryEvaluation = 'eval';
const TokenCategoryDocs = 'docs';
const TokenCategoryLiteral = 'literal';
const TokenCategoryName = 'name';
const TokenCategoryType = 'type';
const TokenCategoryOperator = 'operator';
const TokenCategoryUnknown = 'unknown';
const TokenCategoryPlaceholder = 'placeholder';
const TokenCategoryEnd = 'end';

const TokenCategories: Map<Sym, string> = new Map();
TokenCategories.set(Sym.EvalOpen, TokenCategoryDelimiter);
TokenCategories.set(Sym.EvalClose, TokenCategoryDelimiter);
TokenCategories.set(Sym.SetOpen, TokenCategoryDelimiter);
TokenCategories.set(Sym.SetClose, TokenCategoryDelimiter);
TokenCategories.set(Sym.ListOpen, TokenCategoryDelimiter);
TokenCategories.set(Sym.ListClose, TokenCategoryDelimiter);
TokenCategories.set(Sym.TableOpen, TokenCategoryDelimiter);
TokenCategories.set(Sym.TableClose, TokenCategoryDelimiter);
TokenCategories.set(Sym.TypeOpen, TokenCategoryDelimiter);
TokenCategories.set(Sym.TypeClose, TokenCategoryDelimiter);
TokenCategories.set(Sym.Bind, TokenCategoryRelation);
TokenCategories.set(Sym.Access, TokenCategoryRelation);
TokenCategories.set(Sym.Function, TokenCategoryEvaluation);
TokenCategories.set(Sym.Borrow, TokenCategoryShare);
TokenCategories.set(Sym.Share, TokenCategoryShare);
TokenCategories.set(Sym.Convert, TokenCategoryEvaluation);
TokenCategories.set(Sym.Doc, TokenCategoryDocs);
TokenCategories.set(Sym.Words, TokenCategoryDocs);
TokenCategories.set(Sym.None, TokenCategoryLiteral);
TokenCategories.set(Sym.Type, TokenCategoryRelation);
TokenCategories.set(Sym.Separator, TokenCategoryDelimiter);
TokenCategories.set(Sym.Language, TokenCategoryDelimiter);
TokenCategories.set(Sym.BooleanType, TokenCategoryLiteral);
TokenCategories.set(Sym.NumberType, TokenCategoryType);
TokenCategories.set(Sym.JapaneseNumeral, TokenCategoryLiteral);
TokenCategories.set(Sym.RomanNumeral, TokenCategoryLiteral);
TokenCategories.set(Sym.Pi, TokenCategoryLiteral);
TokenCategories.set(Sym.Infinity, TokenCategoryLiteral);
TokenCategories.set(Sym.Select, TokenCategoryOperator);
TokenCategories.set(Sym.Insert, TokenCategoryOperator);
TokenCategories.set(Sym.Update, TokenCategoryOperator);
TokenCategories.set(Sym.Delete, TokenCategoryOperator);
TokenCategories.set(Sym.Union, TokenCategoryOperator);
TokenCategories.set(Sym.Change, TokenCategoryOperator);
TokenCategories.set(Sym.Previous, TokenCategoryOperator);
TokenCategories.set(Sym.Change, TokenCategoryOperator);
TokenCategories.set(Sym.Placeholder, TokenCategoryPlaceholder);
TokenCategories.set(Sym.Operator, TokenCategoryOperator);
TokenCategories.set(Sym.Conditional, TokenCategoryOperator);
TokenCategories.set(Sym.Text, TokenCategoryLiteral);
TokenCategories.set(Sym.Code, TokenCategoryDocs);
TokenCategories.set(Sym.Number, TokenCategoryLiteral);
TokenCategories.set(Sym.Decimal, TokenCategoryLiteral);
TokenCategories.set(Sym.Base, TokenCategoryLiteral);
TokenCategories.set(Sym.Boolean, TokenCategoryLiteral);
TokenCategories.set(Sym.Name, TokenCategoryName);
TokenCategories.set(Sym.End, TokenCategoryEnd);
TokenCategories.set(Sym.Unknown, TokenCategoryUnknown);

export default TokenCategories;

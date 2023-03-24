import { Grammar, Token, tokenize } from 'prismjs'
import { excludeTokens } from './lang'

export const safeTokenize = (code: string, grammar: Grammar): Token[] => {
    const tokens = tokenize(code, grammar)
        .map((v) => {
            if (typeof v === 'string') {
                return new Token('unexpected', v)
            }
            return v
        })
        .filter((v) => !excludeTokens.includes(v.type))
    console.log(tokens)
    return tokens
}

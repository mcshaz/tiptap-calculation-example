import { MarkType } from '@tiptap/pm/model'

// import { getMarksBetween } from '../helpers/getMarksBetween'
import { InputRule, InputRuleFinder, callOrReturn, ExtendedRegExpMatchArray } from '@tiptap/vue-3'
// import { ExtendedRegExpMatchArray } from '../types'

/**
 * Build an input rule that adds a mark when the
 * matched text is typed into it.
 */
export function wrapWithMark(config: {
  find: InputRuleFinder;
  type: MarkType;
  replace?: string;
  getAttributes?:
    | Record<string, any>
    | ((match: ExtendedRegExpMatchArray) => Record<string, any>)
    | false
    | null;
}) {
  return new InputRule({
    find: config.find,
    handler: ({ state, range, match }) => {
      const attributes = callOrReturn(config.getAttributes, undefined, match)

      if (attributes === false || attributes === null) {
        return null
      }

      const { tr } = state
      const fullMatch = match[0]

      if (fullMatch) {
        /*
        const excludedMarks = getMarksBetween(range.from, range.to, state.doc)
          .filter(item => {
            // @ts-ignore
            const excluded = item.mark.type.excluded as MarkType[]

            return excluded.find(type => type === config.type && type !== item.mark.type)
          })
          .filter(item => item.to > textStart)

        if (excludedMarks.length) {
          return null
        }
        */
        const replaceWith = config.replace ?? fullMatch
        tr.insertText(replaceWith, range.from, range.to)
        const newMark = config.type.create(attributes || {})
        tr.addMark(range.from, range.to + replaceWith.length, newMark)
        // next line stops subsequent typing being within the newly inserted
        tr.removeStoredMark(config.type)
      }
    },
  })
}

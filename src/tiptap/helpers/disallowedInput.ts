import { InputRule, InputRuleFinder } from '@tiptap/vue-3'

/**
 * Build an input rule that replaces text when the
 * matched text is typed into it.
 */
export function disallowedInputRule(config: {
  find: InputRuleFinder,
}) {
  return new InputRule({
    find: config.find,
    handler: ({state, range, match}) => {
      const { tr } = state
      tr.insertText('', range.from, range.to + match[0].length)
    }
  })
}
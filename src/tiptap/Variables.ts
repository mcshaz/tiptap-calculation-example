import { allowedFormulaChars, anthropometryVars } from './../helpers/anthropometryVars'
import { AtomSpan } from './AtomSpan'
import { deleteAtom } from './helpers/deleteAtom'
import { disallowedInputRule } from './helpers/disallowedInput'
import { InputRule } from '@tiptap/vue-3'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    atomSpan: {
      insertVariable: (attributes: { varName: string }) => ReturnType;
      removeVariable: () => ReturnType;
    }
  }
}

export const ExpandVarLetters = AtomSpan.extend({
  addInputRules() {
    const keyLookup = Object.fromEntries(
      Object.entries(anthropometryVars)
        .map(([key, val]) => [key[0], { ...val, key }]))
    const allowedKeys = Object.keys(keyLookup).join('')
    return [
      new InputRule({
        find: new RegExp(`[${allowedKeys}]$`, 'i'),
        handler: ({ state, range, match }) => {
          const { tr } = state
          const fullMatch = match[0]
    
          if (fullMatch) {
            const details = keyLookup[fullMatch]
            const newNode = this.type.create({
              className: 'variable',
              display: details.name,
              text: details.key,
              title: details.description,
            })
            tr.insert(range.to, newNode)
            window.getSelection()?.collapseToEnd()
          }
        }
      }),
      disallowedInputRule({
        find: new RegExp(`[^${allowedKeys + allowedFormulaChars}]$`, 'i'),
      })
    ]
  },

  addCommands() {
    return {
      insertVariable:
        attributes => ({ chain }) => {
          const varDetails = anthropometryVars[attributes.varName]
          var returnBool = chain()
            .focus()
            .insertContent(
              {
                type: this.name,
                attrs: {
                  className: 'variable',
                  display: varDetails.name,
                  text: attributes.varName,
                  title: varDetails.description,
                },
              }
            )
            .run()

          window.getSelection()?.collapseToEnd()
          return returnBool
        },
      removeVariable:
        () => ({ commands }) => deleteAtom(this.name, commands.command) 
    }
  }
})

const findVars = new RegExp(`\\b(${Object.keys(anthropometryVars).join('|')})\\b`, 'g')
export function encodeText(text: string) {
  const content = []
  let lastIndex = 0
  for (const m of text.matchAll(findVars)) {
    const details = anthropometryVars[m[0] as keyof typeof anthropometryVars]
    if (m.index) {
      content.push({
        type: 'text',
        text: text.substring(lastIndex, m.index),
      })
    }
    content.push({
      type: "atomSpan",
      attrs: {
        className: 'variable',
        display: details.name,
        text: m[0],
        title: details.description,
      }
    })
    lastIndex = m.index! + m[0].length
  }
  if (lastIndex < text.length) {
    content.push({
      type: 'text',
      text: text.substring(lastIndex),
    })
  }
  return {
    type: 'paragraph',
    content
  }
}

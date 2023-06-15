import { Node, mergeAttributes } from '@tiptap/core'
import { ClickNodeHandler } from './helpers/ClickNodeHandler';
import type { Plugin } from '@tiptap/pm/state';
import { SingleCommands } from '@tiptap/vue-3';
// import { PluginKey } from '@tiptap/pm/state'

export interface CalculationsOptions {
  formula: string;
  HTMLAttributes: Record<string, any>
  /** [default] 'f(x)' */
  display: string;
  shortcut?: string;
  onClick?: (formula: string) => boolean
}
// export const CalculationPluginKey = new PluginKey('calculation')
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    calculation: {
      insertCalculation: (attributes: { formula: string }) => ReturnType;
      removeCalculation: () => ReturnType;
    }
  }
}

const thisNodeName = 'calculation'
const tag = 'output'
const pmAttr = 'formula'
const elAttr = 'data-' + pmAttr

export const Calculation = Node.create<CalculationsOptions>({
  name: thisNodeName,

  // key: CalculationPluginKey,

  group: 'inline',

  inline: true,

  selectable: false,

  atom: true,

  addOptions() {
    return {
      formula: '',
      display: 'f(x)',
      HTMLAttributes: {},
    }
  },

  addAttributes() {
    return {
      id: {
        default: null,
        parseHTML: element => element.getAttribute('data-id'),
        renderHTML: attributes => {
          if (!attributes.id) {
            return {}
          }

          return {
            'data-id': attributes.id,
          }
        },
      },

      [pmAttr]: {
        default: '',
        parseHTML: element => element.getAttribute(elAttr),
        renderHTML: attributes => {
          if (!attributes[pmAttr]) {
            return {}
          }

          return {
            [elAttr]: attributes[pmAttr],
          }
        },
      },

      title: {
        default: null,
        renderHTML: attributes => {
          if (!attributes[pmAttr]) {
            return {}
          }

          return {
            'title': attributes[pmAttr],
          }
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: `${tag}[${elAttr}]`,
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'output',
      mergeAttributes({ [elAttr]: this.options.formula, 'class': 'inline-calculation' }, this.options.HTMLAttributes, HTMLAttributes),
      this.options.display,
    ]
  },

  addCommands() {
    return {
      insertCalculation:
        attributes => ({ chain }) => {
          var returnBool = chain()
            .focus()
            .insertContent(
              {
                type: this.name,
                attrs: attributes,
              }
            )
            .run()

          window.getSelection()?.collapseToEnd()
          return returnBool
        },
      removeCalculation:
        () => ({ commands }) => deleteAtom(commands) 
    }
  },

  addKeyboardShortcuts() {
    const returnVar: { [key: string]: () => boolean } = {
      Backspace: () => deleteAtom(this.editor.commands),
    }
    if (this.options.shortcut && this.options.onClick) {
      returnVar[this.options.shortcut] = () => this.options.onClick!('')
    }
    return returnVar
  },

  addProseMirrorPlugins() {
    const pmPlugins: Plugin[] = []
    if (this.options.onClick) {
      pmPlugins.push(ClickNodeHandler({
        type: this.type,
        tag,
        PMAttrName: pmAttr,
        HTMLAttrName: elAttr,
        onClick: this.options.onClick
      }))
    }
    return pmPlugins
  },
})

function deleteAtom(commands: SingleCommands) {
  return commands.command(({ tr, state }) => {
    let isCalc = false
    const { selection } = state
    const { empty, anchor } = selection
    // debugger;
    if (!empty) {
      return false
    }

    state.doc.nodesBetween(anchor - 1, anchor, (node, pos) => {
      if (node.type.name === thisNodeName) {
        isCalc = true
        tr.insertText('', pos, pos + node.nodeSize)

        return false
      }
    })

    return isCalc
  })
}

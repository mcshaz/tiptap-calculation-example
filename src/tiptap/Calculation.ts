import { Node, mergeAttributes } from '@tiptap/core'
import { ClickNodeHandler } from './helpers/ClickNodeHandler';
import type { Plugin } from '@tiptap/pm/state';
import { SingleCommands } from '@tiptap/vue-3';

export interface CalculationsOptions {
  formula: string;
  HTMLAttributes: Record<string, any>
  /** the text to display inline in place of the formula. [default] f(x) */
  display: string;
  /** the keyboard shortcut which will execute the onClick function (if provided)
   * (with an empty string argument)
   * [default] Control-Shift-{
   */
  keyboardShortcut: string;
  /** the function to execute when a calculation is clicked.
   * the argument passed will be the formula belonging to the clicked node
   * the function should return whether the operation was successful (usually the result of run())
   */
  onClick?: (formula: string) => boolean
}

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
      keyboardShortcut: 'Control-Shift-{',
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
      mergeAttributes({ [elAttr]: this.options.formula }, this.options.HTMLAttributes, HTMLAttributes),
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
    if (this.options.onClick) {
      returnVar[this.options.keyboardShortcut] = () => this.options.onClick!('')
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

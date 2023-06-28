import { ClickNodeHandler } from './helpers/ClickNodeHandler';
import { deleteAtom } from './helpers/deleteAtom';
import { Node, mergeAttributes } from '@tiptap/vue-3';
import type { Plugin } from '@tiptap/pm/state';


export interface CalculationsOptions {
  formula: string;
  rounding: string;
  HTMLAttributes: Record<string, any>
  /** the text to display inline in place of the formula. [default] f(x) */
  displayText: string;
  /** include the formula as a title attribute, so that browsers display a native 'tooltip'
   * [default] true
   */
  hasTitleAttribute: boolean;
  /** the keyboard shortcut which will execute the onClick function (if provided)
   * with an empty string argument
   * [default] Control-Shift-{
   */
  keyboardShortcut: string;
  /** the function to execute when a calculation is clicked.
   * the argument passed will be the formula belonging to the clicked node
   * the function should return whether the operation was successful (usually the result of run())
   */
  onClick?: (pmAttrs: Record<string, unknown>, elDataset: DOMStringMap) => boolean
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    calculation: {
      insertCalculation: (attributes: { formula: string, rounding: string }) => ReturnType;
      removeCalculation: () => ReturnType;
    }
  }
}

// const thisNodeName = 'calculation'
// const tag = 'output'
// const pmAttr = 'formula'
// const elAttr = 'data-' + pmAttr

export const Calculation = Node.create<CalculationsOptions>({
  name: 'calculation',

  // key: CalculationPluginKey,

  group: 'inline',

  inline: true,

  selectable: false,

  atom: true,

  addOptions() {
    return {
      formula: '',
      rounding: '',
      displayText: 'f(x)',
      HTMLAttributes: {},
      hasTitleAttribute: true,
      keyboardShortcut: 'Control-Shift-{',
    }
  },

  addAttributes() {
    return {
      formula: {
        default: '',
        parseHTML: element => element.getAttribute('data-formula'),
        renderHTML: attributes => {
          if (!attributes.formula) {
            return {}
          }
          return {
            'data-formula': attributes.formula,
          }
        },
      },

      rounding: {
        default: null,
        parseHTML: element => element.getAttribute('data-rounding'),
        renderHTML: attributes => {
          if (!attributes.rounding) {
            return {}
          }
          return {
            'data-rounding': attributes.rounding,
          }
        },
      },

      title: {
        default: null,
        renderHTML: attributes => {
          if (!this.options.hasTitleAttribute || !attributes.formula) {
            return {}
          }
          return {
            'title': attributes.formula,
          }
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'output[data-formula]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    const calculationAttributes = this.options.rounding
      ? { 'data-formula': this.options.formula, 'data-rounding': this.options.rounding }
      : { 'data-formula': this.options.formula }
    return [
      'output',
      mergeAttributes(calculationAttributes, this.options.HTMLAttributes, HTMLAttributes),
      this.options.displayText,
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
        () => ({ commands }) => deleteAtom(this.name, commands.command) 
    }
  },

  addKeyboardShortcuts() {
    const returnVar: { [key: string]: () => boolean } = {
      Backspace: () => deleteAtom(this.name, this.editor.commands.command),
    }
    if (this.options.onClick) {
      returnVar[this.options.keyboardShortcut] = () => this.options.onClick!({},{})
    }
    return returnVar
  },

  addProseMirrorPlugins() {
    const pmPlugins: Plugin[] = []
    if (this.options.onClick) {
      pmPlugins.push(ClickNodeHandler({
        type: this.type,
        querySelector: 'output[data-formula]',
        onClick: this.options.onClick
      }))
    }
    return pmPlugins
  },
})

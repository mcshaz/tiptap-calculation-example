import { Node, mergeAttributes } from "@tiptap/vue-3"
import { deleteAtom } from "./helpers/deleteAtom"

export interface AtomSpanOptions {
  className: string,
  display: string,
  text: string,
  title?: string,
  HTMLAttributes: Record<string, any>,
}

export const AtomSpan = Node.create<AtomSpanOptions>({
  name: 'atomSpan',

  group: 'inline',

  inline: true,

  selectable: false,

  atom: true,
  rank: 100,
  addOptions() {
    return {
      className: '',
      display: '',
      text: '',
      HTMLAttributes: {},
    }
  },
  addAttributes() {
    return {
      className: {
        parseHTML: element => element.className,
        renderHTML: attributes => {
          return {
            'class': attributes.className,
          }
        },
      },

      title: {
        default: null,
        renderHTML: attributes => {
          if (!attributes.title) {
            return {}
          }
          return {
            'title': attributes.title,
          }
        },
      },

      text: {},

      display: {},

    } 
  },

  parseHTML() {
    return [
      {
        tag: 'span',
      },
    ]
  },

  renderHTML({HTMLAttributes}) {
    return [
      'span',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      this.options.display || HTMLAttributes.display
    ]
  },

  renderText({ node }) {
    return this.options.text || node.attrs.text
  },

  addKeyboardShortcuts() {
    return {
      Backspace: () => deleteAtom(this.name, this.editor.commands.command),
    }
  },
  /*
  addCommands() {
    return {
      removeEmptyTextClass: () => ({ state, commands }) => {
        const attributes = getMarkAttributes(state, this.type)
        const hasStyles = Object.entries(attributes).some(([, value]) => !!value)

        if (hasStyles) {
          return true
        }

        return commands.unsetMark(this.name)
      },
    }
  },
  */

})

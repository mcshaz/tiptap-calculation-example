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
  declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    atomSpan: {
      insertAtomSpan: (attributes: AtomSpanOptions) => ReturnType;
      removeAtomSpan: () => ReturnType;
    }
  }
}

  addCommands() {
    return {
      insertAtomSpan:
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
      removeAtomSpan:
        () => ({ commands }) => deleteAtom(this.name, commands.command) 
    }
  },
  */

})

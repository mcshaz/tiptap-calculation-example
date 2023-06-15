import { getAttributes } from '@tiptap/core'
import { NodeType } from '@tiptap/pm/model'
import { Plugin, PluginKey } from '@tiptap/pm/state'

type ClickHandlerOptions = {
  type: NodeType;
  /** HTML element tagname */
  tag: string;
  /** ProseMirror attribute name, the value of which is passed to function */
  PMAttrName: string;
  /** HTML attribute value to be passed to the function [default] data-[PMAttrName]*/
  HTMLAttrName?: string;
  /** Function to be called when the node is clicked */
  onClick: (attrValue: string) => void
}

export function ClickNodeHandler(options: ClickHandlerOptions): Plugin {
  return new Plugin({
    key: new PluginKey('ClickNodeHandler'),
    props: {
      handleClick: (view, _pos, event) => {
        if (event.button !== 0) {
          return false
        }

        const htmlAttrName = options.HTMLAttrName || ('data-' + options.PMAttrName)
        const el = (event.target as HTMLElement)?.closest(`${options.tag}[${htmlAttrName}]`)
        const attrs = getAttributes(view.state, options.type.name)

        const attr: string | null | undefined = el?.getAttribute(htmlAttrName) ?? attrs[options.PMAttrName]

        if (typeof attr === 'string') {
          options.onClick(attr)
          return true
        }

        return false
      },
    },
  })
}
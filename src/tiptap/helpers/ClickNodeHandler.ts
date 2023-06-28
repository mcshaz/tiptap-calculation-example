import { getAttributes } from '@tiptap/vue-3'
import { NodeType } from '@tiptap/pm/model'
import { Plugin, PluginKey } from '@tiptap/pm/state'

type ClickHandlerOptions = {
  type: NodeType;
  /** HTML element tagname */
  querySelector: string;
  /** Function to be called when the node is clicked */
  onClick: (pmAttrs: Record<string, unknown>, elDataset: DOMStringMap) => void
}

export function ClickNodeHandler(options: ClickHandlerOptions): Plugin {
  return new Plugin({
    key: new PluginKey('ClickNodeHandler'),
    props: {
      handleClick: (view, _pos, event) => {
        if (event.button !== 0) {
          return false
        }

        const el = (event.target as HTMLElement)?.closest(options.querySelector) as HTMLElement | null
        if (el) {
          options.onClick(getAttributes(view.state, options.type.name), el.dataset)
          return true
        }

        return false
      },
    },
  })
}
import { CommandProps } from "@tiptap/vue-3"

export function deleteAtom(nodeName: string, command: (fn: (props: CommandProps) => boolean) => boolean) {
  return command(({ tr, state }) => {
    const { selection } = state
    const { empty, anchor } = selection
    if (!empty) {
      return false
    }

    state.doc.nodesBetween(anchor - 1, anchor, (node, pos) => {
      if (node.type.name === nodeName) {
        tr.insertText('', pos, pos + node.nodeSize)

        return true
      }
    })

    return false
  })
}
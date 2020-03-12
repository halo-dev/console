import { Node } from 'tiptap'
import { chainCommands, exitCode } from 'tiptap-commands'

export default class Toc extends Node {
  get name() {
    return 'toc'
  }

  get schema() {
    return {
      group: 'block',
      selectable: false,
      content: 'text*',
      parseDOM: [
        { tag: '[toc]' }
      ],
      toDOM: () => ['aside', { 'class': 'toc' }]
    }
  }
  commands({ type }) {
    return attrs => (state, dispatch) => {
      const { selection } = state
      const position = selection.$cursor ? selection.$cursor.pos : selection.$to.pos
      const node = type.create(attrs)
      const transaction = state.tr.insert(position, node)
      dispatch(transaction)
    }
  }

  keys({ type }) {
    const command = chainCommands(exitCode, (state, dispatch) => {
      dispatch(state.tr.replaceSelectionWith(type.create()).scrollIntoView())
      return true
    })
    return {
      'Mod-Enter': command,
      'Shift-Enter': command
    }
  }
}

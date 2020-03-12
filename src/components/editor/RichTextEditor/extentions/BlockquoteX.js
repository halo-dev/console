import { Node } from 'tiptap'
import { wrappingInputRule, toggleWrap } from 'tiptap-commands'
import { wrapIn, lift } from 'prosemirror-commands'

export default class BlockquoteX extends Node {
  get name() {
    return 'blockquote'
  }

  get schema() {
    return {
      content: 'block*',
      group: 'block',
      defining: true,
      draggable: false,
      parseDOM: [
        { tag: 'blockquote' }
      ],
      toDOM: () => ['blockquote', 0]
    }
  }

  commands({ type, schema }) {
    return () => toggleWrap(type, schema.nodes.paragraph)
  }

  keys({ type }) {
    return {
      // 'Mod-\'': toggleWrap(type),
      'Mod-\'': function(state, dispatch, view) {
        return wrapIn(type)(state, dispatch, view)
      },
      'Mod-"': function(state, dispatch, view) {
        return lift(state, dispatch)
      }
    }
  }

  inputRules({ type }) {
    return [
      wrappingInputRule(/^\s*>\s$/, type)
    ]
  }
}

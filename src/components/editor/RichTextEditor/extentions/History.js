import { Extension } from 'tiptap'
import {
  history, undo, redo, undoDepth, redoDepth
} from 'prosemirror-history'

export default class History extends Extension {
  get name() {
    return 'history'
  }

  get defaultOptions() {
    return {
      depth: '',
      newGroupDelay: '',
      undoDepth: () => {
        // eslint-disable-next-line no-unused-vars
        const { state, view, schema } = this.editor
        return undoDepth(state)
      },
      redoDepth: () => {
        // eslint-disable-next-line no-unused-vars
        const { state, view, schema } = this.editor
        return redoDepth(state)
      }
    }
  }

  // get defaultOptions() {
  //   return {
  //     getContentBlocks: () => {
  //       const { state, view, schema } = this.editor;
  //       return this.doMyThing(state);
  //     }
  //   }
  // }

  keys() {
    const keymap = {
      'Mod-z': undo,
      'Mod-y': redo,
      'Shift-Mod-z': redo
    }

    return keymap
  }

  get plugins() {
    return [
      history({
        depth: this.options.depth,
        newGroupDelay: this.options.newGroupDelay
      })
    ]
  }

  commands() {
    return {
      undo: () => undo,
      redo: () => redo,
      undoDepth: () => undoDepth,
      redoDepth: () => redoDepth
    }
  }
}

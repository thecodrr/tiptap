import { liftEmptyBlock as originalLiftEmptyBlock } from '@tiptap/pm/commands'

import { RawCommands } from '../types.js'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    liftEmptyBlock: {
      /**
       * If the cursor is in an empty textblock that can be lifted, lift the block.
       * @example editor.commands.liftEmptyBlock()
       */
      liftEmptyBlock: () => ReturnType,
    }
  }
}

export const liftEmptyBlock: RawCommands['liftEmptyBlock'] = () => ({ state, dispatch, editor }) => {
  return originalLiftEmptyBlock(state, tr => {
    if (!dispatch) {
      return true
    }

    const { selection, storedMarks } = state
    const marks = storedMarks || (selection.$to.parentOffset && selection.$from.marks())

    if (!marks) { return dispatch(tr) }

    const { splittableMarks } = editor.extensionManager
    const filteredMarks = marks.filter(mark => splittableMarks.includes(mark.type.name))

    tr.ensureMarks(filteredMarks)

    return dispatch(tr)
  })
}

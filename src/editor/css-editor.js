import { EditorView, basicSetup } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { css } from '@codemirror/lang-css';
import { oneDark } from '@codemirror/theme-one-dark';

export function createCssEditor(container, { initialDoc = '', onChange }) {
  const updateListener = EditorView.updateListener.of((update) => {
    if (update.docChanged && onChange) {
      onChange(update.state.doc.toString());
    }
  });

  const state = EditorState.create({
    doc: initialDoc,
    extensions: [
      basicSetup,
      css(),
      oneDark,
      updateListener,
    ],
  });

  const view = new EditorView({
    state,
    parent: container,
  });

  return {
    view,
    getDoc: () => view.state.doc.toString(),
    setDoc: (str) => {
      view.dispatch({
        changes: { from: 0, to: view.state.doc.length, insert: str }
      });
    }
  };
}

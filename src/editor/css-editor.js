import { EditorView, basicSetup } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { css } from '@codemirror/lang-css';
import { oneDark } from '@codemirror/theme-one-dark';

function createExtensions(updateListener, readOnly) {
  const extensions = [
    basicSetup,
    css(),
    oneDark,
  ];

  if (updateListener && !readOnly) {
    extensions.push(updateListener);
  }

  if (readOnly) {
    extensions.push(EditorState.readOnly.of(true));
  }

  return extensions;
}

export function createCssEditor(container, { initialDoc = '', readOnly = false, onChange } = {}) {
  const updateListener = EditorView.updateListener.of((update) => {
    if (update.docChanged && onChange) {
      onChange(update.state.doc.toString());
    }
  });

  const state = EditorState.create({
    doc: initialDoc,
    extensions: createExtensions(updateListener, readOnly),
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
    },
    setReadOnly: (isReadOnly) => {
      const currentDoc = view.state.doc.toString();

      view.setState(EditorState.create({
        doc: currentDoc,
        extensions: createExtensions(updateListener, isReadOnly),
      }));
    }
  };
}

import { EditorView, basicSetup } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { html } from '@codemirror/lang-html';
import { oneDark } from '@codemirror/theme-one-dark';

export function createHtmlEditor(container, { initialDoc = '', readOnly = false, onChange }) {
  const updateListener = EditorView.updateListener.of((update) => {
    if (update.docChanged && onChange) {
      onChange(update.state.doc.toString());
    }
  });

  const extensions = [
    basicSetup,
    html(),
    oneDark,
    updateListener,
  ];

  if (readOnly) {
    extensions.push(EditorState.readOnly.of(true));
  }

  const state = EditorState.create({
    doc: initialDoc,
    extensions,
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
      // To toggle readOnly, we recreate the state to avoid complex compartment logic
      // for this simple app. In a heavy app, we'd use Compartments.
      const currentDoc = view.state.doc.toString();
      const newExtensions = [
        basicSetup,
        html(),
        oneDark,
        updateListener,
      ];
      if (isReadOnly) newExtensions.push(EditorState.readOnly.of(true));
      
      view.setState(EditorState.create({
        doc: currentDoc,
        extensions: newExtensions
      }));
    }
  };
}

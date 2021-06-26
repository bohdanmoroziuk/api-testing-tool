import { EditorState, basicSetup } from '@codemirror/basic-setup';
import { defaultTabBinding } from '@codemirror/commands';
import { EditorView, keymap } from '@codemirror/view';
import { json } from '@codemirror/lang-json';

const setupEditors = () => {
  const jsonRequestBody = document.querySelector('[data-json-request-body]');
  const jsonResponseBody = document.querySelector('[data-json-response-body]');

  const basicExtensions = [
    basicSetup,
    keymap.of([defaultTabBinding]),
    json(),
    EditorState.tabSize.of(2),
  ];

  const requestEditorState = EditorState.create({
    doc: '{\n\t\n}',
    extensions: basicExtensions
  });

  const requestEditor = new EditorView({
    state: requestEditorState,
    parent: jsonRequestBody,
  });

  const responseEditorExtensions = [
    ...basicExtensions, 
    EditorView.editable.of(false),
  ];

  const responseEditorState = EditorState.create({
    doc: '{}',
    extensions: responseEditorExtensions,
  });

  const responseEditor = new EditorView({
    state: responseEditorState,
    parent: jsonResponseBody,
  });

  const updateResponseEditor = (value) => {
    responseEditor.dispatch({
      changes: {
        from: 0,
        to: responseEditor.state.doc.length,
        insert: JSON.stringify(value, null, 2),
      }, 
    });
  };

  return {
    requestEditor,
    responseEditor,
    updateResponseEditor,
  };
};

export default setupEditors;

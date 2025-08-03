import React, { useState } from 'react';
import { Bold, Italic, List } from 'lucide-react';

const RichTextEditor = ({ value, onChange, placeholder = "Enter detailed description..." }) => {
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isList, setIsList] = useState(false);

  const applyFormat = (command, value = null) => {
    document.execCommand(command, false, value);
    const editor = document.getElementById('rich-editor');
    if (editor) {
      onChange(editor.innerHTML);
    }
  };

  const handleKeyUp = () => {
    const editor = document.getElementById('rich-editor');
    if (editor) {
      onChange(editor.innerHTML);
      setIsBold(document.queryCommandState('bold'));
      setIsItalic(document.queryCommandState('italic'));
      setIsList(document.queryCommandState('insertUnorderedList'));
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="flex gap-2 p-2 bg-gray-50 border-b">
        <button
          type="button"
          onClick={() => applyFormat('bold')}
          className={`p-2 rounded hover:bg-gray-200 ${isBold ? 'bg-gray-300' : ''}`}
        >
          <Bold size={16} />
        </button>
        <button
          type="button"
          onClick={() => applyFormat('italic')}
          className={`p-2 rounded hover:bg-gray-200 ${isItalic ? 'bg-gray-300' : ''}`}
        >
          <Italic size={16} />
        </button>
        <button
          type="button"
          onClick={() => applyFormat('insertUnorderedList')}
          className={`p-2 rounded hover:bg-gray-200 ${isList ? 'bg-gray-300' : ''}`}
        >
          <List size={16} />
        </button>
      </div>
      <div
        id="rich-editor"
        contentEditable
        className="p-3 min-h-32 outline-none"
        dangerouslySetInnerHTML={{ __html: value }}
        onInput={handleKeyUp}
        onKeyUp={handleKeyUp}
        style={{ minHeight: '120px' }}
        placeholder={placeholder}
      />
    </div>
  );
};

export default RichTextEditor;
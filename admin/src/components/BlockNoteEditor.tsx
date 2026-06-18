"use client";

import React, { useEffect, useRef } from 'react';
import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/mantine';
import '@blocknote/mantine/style.css';

interface BlockNoteEditorProps {
  value?: string;
  onChange?: (html: string) => void;
}

export default function BlockNoteEditor({ value = '', onChange }: BlockNoteEditorProps) {
  const editor = useCreateBlockNote();
  const isInitialized = useRef(false);

  // Load initial HTML content once on mount/initialization
  useEffect(() => {
    if (!editor || isInitialized.current) return;

    async function loadContent() {
      if (value) {
        try {
          const blocks = await editor.tryParseHTMLToBlocks(value);
          editor.replaceBlocks(editor.document, blocks);
        } catch (e) {
          console.error('Failed to parse initial HTML to BlockNote blocks:', e);
        }
      }
      isInitialized.current = true;
    }

    loadContent();
  }, [editor, value]);

  // Convert block updates back to HTML and notify Form
  const handleEditorChange = async () => {
    if (!onChange || !isInitialized.current) return;
    try {
      const html = await editor.blocksToHTMLLossy(editor.document);
      onChange(html);
    } catch (e) {
      console.error('Failed to convert BlockNote blocks to HTML:', e);
    }
  };

  return (
    <div style={{ minHeight: '350px', border: '1px solid #d9d9d9', borderRadius: '8px', overflow: 'hidden', background: '#fff' }}>
      <BlockNoteView 
        editor={editor} 
        onChange={handleEditorChange}
        theme="light"
      />
    </div>
  );
}

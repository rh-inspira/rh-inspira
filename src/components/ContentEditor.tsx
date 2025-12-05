
import React, { useRef, useEffect, useState } from 'react';

interface ContentEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  readOnly?: boolean;
}

const ContentEditor: React.FC<ContentEditorProps> = ({
  value,
  onChange,
  className = '',
  placeholder = '',
  readOnly = false,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  
  // Ref to track the last value we sent to parent to avoid cursor jumping
  const lastHtmlRef = useRef(value);

  // Initial load and external updates
  useEffect(() => {
    if (editorRef.current) {
      // Normalize values for comparison
      let displayValue = value;
      // If the incoming value is purely text with \n, convert to <br> for display
      if (value && !value.includes('<') && value.includes('\n')) {
        displayValue = value.replace(/\n/g, '<br>');
      }

      // Only update if significantly different to prevent cursor jumps during typing
      if (value !== lastHtmlRef.current && editorRef.current.innerHTML !== displayValue) {
        editorRef.current.innerHTML = displayValue;
        lastHtmlRef.current = value;
      }
      
      // Handle empty state for placeholder logic
      if (!value) {
        editorRef.current.innerHTML = '';
      }
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      lastHtmlRef.current = html;
      onChange(html);
    }
  };

  const insertLink = () => {
    const selection = window.getSelection();
    if (!selection) return;

    const hasSelection = selection.toString().length > 0;
    let url = '';
    let text = '';

    // Save focus to editor before prompting
    editorRef.current?.focus();

    if (hasSelection) {
      // User has selected text -> convert to link
      url = window.prompt('Insira a URL do link:', 'https://') || '';
      if (url) {
        if (!url.match(/^https?:\/\//i) && !url.startsWith('mailto:')) {
            url = 'https://' + url;
        }
        // Use insertHTML to ensure we can set target="_blank"
        const linkHtml = `<a href="${url}" target="_blank" rel="noopener noreferrer">${selection.toString()}</a>`;
        document.execCommand('insertHTML', false, linkHtml);
      }
    } else {
      // No selection -> insert new link
      text = window.prompt('Texto do link:') || '';
      if (!text) return;
      
      url = window.prompt('URL do link:', 'https://') || '';
      if (!url) return;

      if (!url.match(/^https?:\/\//i) && !url.startsWith('mailto:')) {
        url = 'https://' + url;
    }

      const linkHtml = `<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>`;
      document.execCommand('insertHTML', false, linkHtml);
    }

    handleInput();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Bold: Ctrl+B / Cmd+B
    if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
      e.preventDefault();
      document.execCommand('bold', false, undefined);
      handleInput();
    }
    
    // Link: Ctrl+K / Cmd+K
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      insertLink();
    }

    // Auto-link on Enter
    if (e.key === 'Enter') {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            if (range.startContainer.nodeType === Node.TEXT_NODE) {
                const node = range.startContainer;
                const content = node.textContent || '';
                const caretPos = range.startOffset;
                // Get text before cursor
                const textBefore = content.slice(0, caretPos);
                // Regex to find the last word if it looks like a URL
                const match = textBefore.match(/((https?:\/\/|www\.)[^\s]+)$/);

                if (match) {
                    const urlStr = match[0];
                    // Create range for the url text
                    const newRange = document.createRange();
                    newRange.setStart(node, caretPos - urlStr.length);
                    newRange.setEnd(node, caretPos);
                    selection.removeAllRanges();
                    selection.addRange(newRange);

                    let finalUrl = urlStr;
                    if (!finalUrl.match(/^https?:\/\//i)) {
                        finalUrl = 'https://' + finalUrl;
                    }

                    document.execCommand('insertHTML', false, `<a href="${finalUrl}" target="_blank" rel="noopener noreferrer">${urlStr}</a>`);
                    
                    // Collapse selection to end of inserted link
                    selection.collapseToEnd();
                    
                    // We DO NOT prevent default here. We let the Enter key proceed to create the newline 
                    // after the link we just created.
                }
            }
        }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    
    // Check if pasted text is a URL
    const urlRegex = /^(https?:\/\/|www\.)[^\s]+$/i;
    
    if (urlRegex.test(text.trim())) {
        let href = text.trim();
        if (!href.match(/^https?:\/\//i)) href = 'https://' + href;
        
        // Insert as link
        const linkHtml = `<a href="${href}" target="_blank" rel="noopener noreferrer">${text}</a>&nbsp;`;
        document.execCommand('insertHTML', false, linkHtml);
    } else {
        // Insert as plain text (stripping styles from source)
        document.execCommand('insertText', false, text);
    }
    handleInput();
  };

  return (
    <div className="relative group h-full flex flex-col">
      <div
        ref={editorRef}
        contentEditable={!readOnly}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        className={`
          flex-1 overflow-y-auto outline-none 
          ${className} 
          empty:before:content-[attr(data-placeholder)] empty:before:text-slate-400 
          cursor-text
          [&_a]:text-blue-600 [&_a]:underline [&_a]:cursor-pointer [&_a]:font-medium [&_a]:hover:text-blue-800
          [&_b]:font-bold [&_strong]:font-bold
        `}
        data-placeholder={placeholder}
        style={{ whiteSpace: 'pre-wrap' }} 
      />
    </div>
  );
};

export default ContentEditor;

/**
 * useDragDrop.ts — Hook for making components file droppable
 */
import { useState, useCallback, useEffect } from 'react';
import { showToast } from '../stores/toastStore';

interface UseDragDropOptions {
  onDrop: (text: string, file: File) => void;
  accept?: string; // Content-Type prefix to accept, e.g. "text/" or "application/json"
}

export function useDragDrop({ onDrop, accept }: UseDragDropOptions) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      
      // Basic type validation if accept is provided
      if (accept && !file.type.startsWith(accept) && !file.name.endsWith('.json') && !file.name.endsWith('.txt') && !file.name.endsWith('.md')) {
        showToast(`Invalid file type: ${file.name}`, '❌');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result && typeof event.target.result === 'string') {
          onDrop(event.target.result, file);
          showToast(`Loaded ${file.name}`, '📂');
        }
      };
      reader.onerror = () => showToast('Failed to read file', '❌');
      reader.readAsText(file);
    }
  }, [onDrop, accept]);

  return {
    isDragging,
    dragProps: {
      onDragOver: handleDragOver,
      onDragLeave: handleDragLeave,
      onDrop: handleDrop,
    }
  };
}

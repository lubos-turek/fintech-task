import React, { ReactNode } from 'react';
import { Category } from './types';

function highlightText(text: string, searchedText: string | undefined, isSearchResult: boolean): ReactNode {
  if (!isSearchResult || !searchedText || !text) {
    return text;
  }

  const lowerText = text.toLowerCase();
  const lowerSearchedText = searchedText.toLowerCase();
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let index = 0;

  while ((index = lowerText.indexOf(lowerSearchedText, lastIndex)) !== -1) {
    // Add text before match (grey when isSearchResult is true)
    if (index > lastIndex) {
      parts.push(<span key={parts.length} className="text-gray-500">{text.substring(lastIndex, index)}</span>);
    }
    // Add matched text in bold
    parts.push(<strong key={parts.length}>{text.substring(index, index + searchedText.length)}</strong>);
    lastIndex = index + searchedText.length;
  }

  // Add remaining text (grey when isSearchResult is true)
  if (lastIndex < text.length) {
    parts.push(<span key={parts.length} className="text-gray-500">{text.substring(lastIndex)}</span>);
  }

  // If no matches found, make entire text grey
  if (parts.length === 0) {
    return <span className="text-gray-500">{text}</span>;
  }

  return <>{parts}</>;
}

export function getDisplayLabel(path: string, displayWholePath: boolean = false, isSearchResult: boolean = false, searchedText?: string): ReactNode {
  let processedPath = path;
  
  // Strip first part before ' > ' separator if isSearchResult is true
  if (isSearchResult && path.includes(' > ')) {
    const parts = path.split(' > ');
    processedPath = parts.slice(1).join(' > ');
  }
  
  if (displayWholePath) {
    // Split by ' > ' and join with styled › symbol
    const parts = processedPath.split(' > ');
    return parts.map((part, index) => (
      <span key={index}>
        {index > 0 && <span className="text-gray-500"> › </span>}
        {highlightText(part, searchedText, isSearchResult)}
      </span>
    ));
  }
  if (!processedPath.includes(' > ')) {
    return highlightText(processedPath, searchedText, isSearchResult);
  }
  const parts = processedPath.split(' > ');
  const lastPart = parts[parts.length - 1];
  return highlightText(lastPart || processedPath, searchedText, isSearchResult);
}


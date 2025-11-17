import { ReactNode } from "react";

function highlightText(text: string, searchedText: string | undefined): ReactNode {
  if (!searchedText || !text) {
    return text;
  }

  const lowerText = text.toLowerCase();
  const lowerSearchedText = searchedText.toLowerCase();
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let index = 0;

  while ((index = lowerText.indexOf(lowerSearchedText, lastIndex)) !== -1) {
    // Add text before match (grey)
    if (index > lastIndex) {
      parts.push(
        <span key={parts.length} className="text-gray-500">
          {text.substring(lastIndex, index)}
        </span>
      );
    }
    // Add matched text in bold
    parts.push(<strong key={parts.length}>{text.substring(index, index + searchedText.length)}</strong>);
    lastIndex = index + searchedText.length;
  }

  // Add remaining text (grey)
  if (lastIndex < text.length) {
    parts.push(
      <span key={parts.length} className="text-gray-500">
        {text.substring(lastIndex)}
      </span>
    );
  }

  // If no matches found, make entire text grey
  if (parts.length === 0) {
    return <span className="text-gray-500">{text}</span>;
  }

  return <>{parts}</>;
}

export function getDisplayLabel(path: string, searchedText?: string): ReactNode {
  let processedPath = path;

  // Strip first part before ' > ' separator
  if (path.includes(" > ")) {
    const parts = path.split(" > ");
    processedPath = parts.slice(1).join(" > ");
  }

  // Split by ' > ' and join with styled › symbol
  const parts = processedPath.split(" > ");
  return parts.map((part, index) => (
    <span key={index}>
      {index > 0 && <span className="text-gray-500"> › </span>}
      {highlightText(part, searchedText)}
    </span>
  ));
}

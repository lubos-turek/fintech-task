export const ExpandIcon = ({ isExpanded, size }: { isExpanded: boolean, size: number }) => {
  let symbol;
  if (size === 0) {
    symbol = '●';
  } else if (isExpanded) {
    symbol = '▼';
  } else {
    symbol = '▶';
  }

  return (<span className="mr-2 text-gray-500">
    {symbol}
  </span>)
};


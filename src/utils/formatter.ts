export const formatDate = (isoString: string): string => {
  const date = new Date(isoString);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
};

export const formatPercentage = (num: number): string => {
  return `${num.toFixed(2)}%`;
};

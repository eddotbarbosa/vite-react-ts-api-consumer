const formatDate = function (date: string): string {
  return new Date(date).toLocaleDateString('en-gb', {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export {formatDate};

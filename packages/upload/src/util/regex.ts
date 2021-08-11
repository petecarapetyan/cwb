

// already freshened
export const underscore4space = (str: string) => {
  const searchRegExp = / /g;
  const replaceWith = "_";
  return str.replace(searchRegExp, replaceWith);
};

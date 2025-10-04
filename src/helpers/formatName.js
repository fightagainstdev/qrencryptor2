export const formatName = (fileName) => {
  //remove .qr
  let trimmed = fileName.replace(".qr", "");
  //remove parenthesis
  let clean = trimmed.replace(/ *\([^)]*\) */g, "");

  return clean;
};

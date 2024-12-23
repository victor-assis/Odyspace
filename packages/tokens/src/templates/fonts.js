import fs from 'fs';

const formatsMap = {
  woff2: 'woff2',
  woff: 'woff',
  ttf: 'truetype',
  otf: 'opentype',
  svg: 'svg',
  eot: 'embedded-opentype',
};

const generateUrls = (family, fileName) => {
  return Object.keys(formatsMap)
    .map((extension) => {
      const filePath = `packages/tokens/src/assets/fonts/${family.toLowerCase()}/${fileName}.${extension}`;
      if (fs.existsSync(filePath)) {
        return `url("../assets/fonts/${family.toLowerCase()}/${fileName}.${extension}") format("${formatsMap[extension]}")`;
      }
    })
    .filter(Boolean);
};

const generateFontFace = (family, weight, style, urls) => {
  if (!urls.length) return '';
  return `
@font-face {
  font-family: "${family}";
  font-style: ${style};
  font-weight: ${weight};
  font-display: swap;
  src: ${urls.join(',\n\t\t')};
}`;
};

export const fontsCssFormatter = (dictionary) => {
  return dictionary.allTokens.reduce((fontList, prop) => {
    const { value: { family, weight, file } } = prop.original;

    if (!family) return fontList;

    const normalUrls = generateUrls(family, file);
    const normalFontCss = generateFontFace(family, weight, 'normal', normalUrls);

    if (normalFontCss) fontList.push(normalFontCss);

    const italicUrls = generateUrls(family, `${file}Italic`);
    const italicFontCss = generateFontFace(family, weight, 'italic', italicUrls);

    if (italicFontCss) fontList.push(italicFontCss);

    return fontList;
  }, []).join('\n');
};

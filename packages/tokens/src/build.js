import StyleDictionary from 'style-dictionary';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

import { transforms, transformGroups } from './transforms.js';
import { formats } from './formats.js';
import { actions } from './actions.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Captura argumentos no terminal e filtra tema e plataforma
/**
 * @example "npm run build:tokens theme=white platform=js"
 */
// const themeArg = process.argv.find(arg => arg.includes('theme=')).replace('theme=', '');
// const platformArg = process.argv.find(arg => arg.includes('platform=')).replace('platform=', '');
const themeArg = '';
const platformArg = '';

// Loop para registrar os `transforms`, `transformGroup`, `format` e `actions`
transforms.forEach(transformer => StyleDictionary.registerTransform(transformer));
transformGroups.forEach(transformGroup => StyleDictionary.registerTransformGroup(transformGroup));
formats.forEach(format => StyleDictionary.registerFormat(format));
actions.forEach(action => StyleDictionary.registerAction(action));

// Obtém todos os temas de tokens
const themes = fs
  .readdirSync(`${__dirname}/tokens/themes/`)
  .filter(t => fs.statSync(path.join(`${__dirname}/tokens/themes/`, t)).isDirectory());

const tokensSource = theme => [
  `${__dirname}/tokens/themes/${theme}/**/*.json`,
  `${__dirname}/tokens/foundation/**/*.json`
];

// Configuração para os outputs das determinadas linguagens
const getConfig = theme => {
  return {
    source: tokensSource(theme),
    platforms: {
      css_scss: {
        prefix: 'ody',
        transformGroup: 'customCss',
        buildPath: `dist/tokens/${theme}/`,
        files: [
          {
            destination: 'tokens.css',
            format: 'custom/css',
            options: {
              selector: `:root[class*="odyspace-theme-${theme}"]`,
              theme
            },
            filter: token => token.theme === theme || token.theme === 'global'
          },
          {
            destination: 'tokens.scss',
            format: 'custom/scss',
            filter: token => [theme, 'global'].includes(token.theme),
            options: {
              theme
            },
          },
        ]
      },
      js: {
        prefix: 'ody',
        transformGroup: 'customJs',
        buildPath: `dist/tokens/${theme}/`,
        files: [
          {
            destination: 'tokens.js',
            format: 'custom/tokens-theme-module-flat',
            filter: token => token.theme === theme || token.theme === 'global'
          },
          {
            destination: 'tokens.d.ts',
            format: 'typescript/es6-declarations',
            filter: token => token.theme === theme || token.theme === 'global',
            options: {
              showFileHeader: false
            }
          }
        ]
      },
      json: {
        prefix: 'ody',
        buildPath: `dist/tokens/${theme}/`,
        files: [
          {
            destination: 'tokens.json',
            format: 'json/nested',
            filter: token => token.theme === theme || token.theme === 'global'
          }
        ]
      },
      style_guide: {
        transformGroup: 'customStatic',
        buildPath: 'dist/docs/tokens/static/themes/',
        files: [
          {
            destination: `${theme}.html`,
            format: 'custom/theme',
            filter: token => token.theme === theme || token.theme === 'global',
            options: {
              theme
            },
          },
        ],
      },
      pallet: {
        transformGroup: 'customStatic',
        buildPath: 'dist/docs/tokens/static/private/',
        files: [
          {
            destination: 'pallet.html',
            format: 'custom/pallet',
            filter: prop => prop.theme,
          },
        ],
      }
    }
  }
};

const buildTypes = ['css_scss', 'js'];

const build = async (sd) => {
  await sd.hasInitialized;

  // Verifica se o usuário determinou uma plataforma para o build
  if (platformArg && buildTypes.includes(platformArg)) {
    sd.buildPlatform(platformArg);
  }

  await sd.buildAllPlatforms();

  const additionalTokensConfig = {
    source: tokensSource('core'),
    platforms: {
      scss_ref: {
        prefix: 'ody',
        transformGroup: 'customCss',
        buildPath: `dist/tokens/`,
        files: [
          {
            destination: 'tokens.scss',
            format: 'custom/scss-ref',
            filter: token => ['core', 'global'].includes(token.theme)
          }
        ]
      },
      js_ref: {
        prefix: 'ody',
        transformGroup: 'customJs',
        buildPath: `dist/tokens/`,
        files: [
          {
            destination: 'tokens-themes.js',
            format: 'custom/tokens-theme',
            options: {
              themes
            },
          },
          {
            destination: 'tokens-themes.mjs',
            format: 'custom/tokens-theme-esm',
            options: {
              themes
            },
          },
          {
            destination: 'tokens-themes.d.ts',
            format: 'custom/tokens-theme-declarations',
            options: {
              themes
            },
          }
        ]
      },
      json_ref: {
        prefix: 'ody',
        buildPath: `dist/tokens/`,
        files: [
          {
            destination: 'tokens-themes.json',
            format: 'custom/tokens-theme-json',
            options: {
              themes
            }
          }
        ]
      },
      css_fonts: {
        prefix: 'ody',
        transformGroup: 'customCss',
        buildPath: 'dist/tokens/',
        files: Object.keys(sd.tokens.font.family).map(fonts => ({
          destination: `fonts/${fonts}.css`,
          format: 'custom/fontsCss',
          filter: ({attributes}) => attributes.category === 'font' && attributes.item === fonts,
        })),
        actions: ['copy_fonts'],
      },
    },
  }

  await new StyleDictionary(additionalTokensConfig).buildAllPlatforms();
}

// Loop para buildar os temas
// Verifica se o usuário especificou um tema para build
if (themeArg) {
  const sd = new StyleDictionary(getConfig(themeArg));
  console.log(`\nProcessing theme: ${themeArg}`);
  build(sd);
} else {
  themes.forEach(theme => {
    const sd = new StyleDictionary(getConfig(theme));
    console.log(`\nProcessing theme: ${theme}`);
    build(sd);
  });
}
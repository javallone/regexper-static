import React from 'react';
import { renderToString } from 'react-dom/server';
import fs from 'fs';
import util from 'util';
import cheerio from 'cheerio';

import './i18n';

const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

readdir('./src/pages')
  .then(pages => (
    Promise.all(pages.map(async page => {
      const Component = (await import(`./pages/${ page }/Component`)).default;
      const pagePath = `./build/${ page }.html`;

      const markup = cheerio.load(await readFile(pagePath));

      markup('#root').html(renderToString(<Component/>));
      await writeFile(pagePath, markup.html());

      console.log(`${ page } prerendered`); // eslint-disable-line no-console
    }))
  ))
  .then(() => console.log('Done prerendering')) // eslint-disable-line no-console
  .catch(e => {
    console.log(e.toString()); // eslint-disable-line no-console
    process.exit(1);
  });

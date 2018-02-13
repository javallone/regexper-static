import React from 'react';
import { renderToString } from 'react-dom/server';
import fs from 'fs';
import cheerio from 'cheerio';

import './i18n';

const pages = fs.readdirSync('./src/pages');

pages.forEach(page => {
  import(`./pages/${ page }/Component`).then(component => {
    const Component = component.default;
    const pagePath = `./build/${ page }.html`;

    const markup = cheerio.load(fs.readFileSync(pagePath));

    markup('#root').html(renderToString(<Component/>));
    fs.writeFileSync(pagePath, markup.html());
  });
});

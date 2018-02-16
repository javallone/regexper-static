const util = require('util');
const path = require('path');
const fs = require('fs');
const yaml = require('js-yaml');

const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const localesDir = path.resolve(__dirname, '../src/locales');

const loadLocales = async () => {
  const languages = (await readdir(localesDir)).filter(name => name !== 'index.js');

  let localeData = {};

  await Promise.all(languages.map(async lang => {
    const langDir = path.resolve(localesDir, lang);
    const namespaces = (await readdir(langDir))
      .filter(file => /\.yaml$/.test(file));

    localeData[lang] = {};

    await Promise.all(namespaces.map(async ns => {
      const nsFile = path.resolve(langDir, ns);
      localeData[lang][ns.replace('.yaml', '')] = yaml.safeLoad(await readFile(nsFile));
    }));
  }));

  return localeData;
};

const saveLocales = async locales => {
  await Promise.all(Object.keys(locales).map(async langName => {
    const lang = locales[langName];

    await Promise.all(Object.keys(lang).map(async nsName => {
      const nsFile = path.resolve(localesDir, langName, `${ nsName }.yaml`);
      const yamlDump = yaml.safeDump(lang[nsName], {
        sortKeys: true
      });
      await writeFile(nsFile, yamlDump);
    }));
  }));
};

loadLocales()
  .then(async locales => {
    const requiredKeys = Object.keys(locales.en.translation);
    const languages = Object.keys(locales).filter(lang => lang !== 'en');

    languages.forEach(langName => {
      const lang = locales[langName];
      const presentKeys = Object.keys(lang.translation || {});

      if (!lang.translation) {
        lang.translation = {};
      }

      if (!lang.missing) {
        lang.missing = {};
      }

      requiredKeys.forEach(key => {
        if (!presentKeys.includes(key)) {
          console.log(`es needs translation for "${ key }"`); // eslint-disable-line no-console
          lang.missing[key] = locales.en.translation[key];
        }
      });
    });

    await saveLocales(locales);
  })
  .then(() => {
    console.log('Done updating locales'); // eslint-disable-line no-console
  })
  .catch(e => {
    console.log(e.toString()); // eslint-disable-line no-console
    process.exit(1);
  });

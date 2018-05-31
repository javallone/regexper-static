const util = require('util');
const path = require('path');
const fs = require('fs');
const yaml = require('js-yaml');
const colors = require('colors/safe');

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
    const sourceLocale = locales.en.translation;
    const requiredKeys = Object.keys(sourceLocale);
    const languages = Object.keys(locales).filter(lang => lang !== 'en');

    languages.forEach(langName => {
      const lang = locales[langName];
      const presentKeys = Object.keys(lang).filter(nsName => nsName !== 'missing').reduce((list, nsName) => {
        return list.concat(Object.keys(lang[nsName]));
      }, []);
      const missingKeys = requiredKeys.filter(key => !presentKeys.includes(key));
      const extraKeys = presentKeys.filter(key => !requiredKeys.includes(key));

      if (!lang.translation) {
        lang.translation = {};
      }

      if (!lang.missing) {
        lang.missing = {};
      }

      missingKeys.forEach(key => {
        if (lang.missing[key]) {
          return;
        }

        console.log(colors.yellow.bold('MISSING:'), `${ langName } needs value for "${ colors.bold(key) }".`); //eslint-disable-line no-console
        lang.missing[key] = sourceLocale[key];
      });

      presentKeys.forEach(key => {
        if (!lang.missing[key]) {
          return;
        }

        console.log(colors.yellow.bold('DEFINED:'), `Removing "${ colors.bold(key) }" from ${ langName}.missing. It is defined elsewhere.`); // eslint-disable-line no-console
        delete lang.missing[key];
      });

      extraKeys.forEach(key => {
        console.log(colors.yellow.bold('EXTRA:'), `${ langName } has extra key for "${ colors.bold(key) }". It should be removed.`); // eslint-disable-line no-console
      });
    });

    return locales;
  })
  .then(saveLocales)
  .then(() => {
    console.log('Done updating locales'); // eslint-disable-line no-console
  })
  .catch(e => {
    console.error(colors.red.bold('FAILED:'), e); // eslint-disable-line no-console
    process.exit(1);
  });

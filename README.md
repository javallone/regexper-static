# Regexper [![CircleCI](https://circleci.com/gh/javallone/regexper-static.svg?style=svg)](https://circleci.com/gh/javallone/regexper-static)

Code for the http://regexper.com/ site.

## Contributing

I greatly appreciate any contributions that you may have for the site. Feel free to fork the project and work on any of the reported issues, or let me know about any improvements you think would be beneficial.

When sending pull requests, please keep them focused on a single issue. I would rather deal with a dozen pull requests for a dozen issues with one change each over one pull request fixing a dozen issues. Also, I appreciate tests to be included with feature development, but for minor changes I will probably not put up much of a fuss if they're missing.

### Working with the code

Node is required for working with this site.

To start with, install the necessary dependencies:

    $ yarn install

To start a development server, run:

    $ yarn start

### Translating

A helper tool is available to support maintaining translations. Running `yarn i18n:scrub` will update locale data files under `src/locales` by normalizing YAML syntax across all the files, maintaining a `missing.yaml` file under each locale, and indicating any existing translations that appear to be no longer used. For this, the `src/locales/en/translation.yaml` file is used as a source of truth.

To add a new locale, first create a directory for the locale under `src/locales` (no files need to be added at this point), then run `yarn i18n:scrub`. This will create a `src/locales/<locale name>/missing.yaml` file that contains required translations. Add a `src/locales/<locale name>/translation.yaml` file and at a minimum add a translation for the `/displayName` value. This should be the translated name of the locale your are adding.

If you are looking to translation missing text for a locale that is already present in the project, start by running `yarn i18n:scrub`. Check the `src/locales/<locale name>/missing.yaml` file for translations that are needed. Add any updated translations to `src/locales/<locale name>/translation.yaml`.

Before committing any updated translations, run `yarn i18n:scrub` again to maintain syntax in the YAML files and remove any translated entries from `missing.yaml`. Commit any changes to the `translation.yaml` and `missing.yaml` files.

### Available scripts

* `yarn start` - Start a development server on port 8080
* `yarn start:prod` - Run a build and start a web server on port 8080. This will not automatically rebuild.
* `yarn build` - Run a production build (used for deployments and for rebuilding when running `yarn start:prod`)
* `yarn deploy` - Deploy application to AWS S3 bucket
* `yarn test` - Run lint and unit tests
* `yarn test:lint` - Run eslint
* `yarn test:unit` - Run jest unit tests
* `yarn test:watch` - Run jest in watch mode
* `yarn test:bundle-analyzer` - Generate webpack-bundle-analyzer report
* `yarn i18n:scrub` - Scrubs i18n locale configs. Adds missing keys and normalizes YAML formatting

## Configuration

Several environment variables are used to configure the application at build-time. None of these values are required during testing.

* `NODE_ENV` - Effects build-time optimizations. Set to `"production"` for builds and unit tests in package.json. Setting to anything else will show a banner in the application's header.
* `GA_PROPERTY` - Google Analytics property ID.
* `SENTRY_KEY` - Sentry.io DSN key for error reporting.
* `CIRCLE_BRANCH`, `CIRCLE_BUILD_NUM`, and `CIRCLE_SHA1` - CircleCI values used to generate build ID. Displayed in application footer and used in Sentry.io error reports.
* `CLOUD_FRONT_ID` - AWS CloudFront distribution ID to invalidating when running `yarn deploy`
* `DEPLOY_BUCKET` - AWS S3 bucket to deploy application to when running `yarn deploy`.
* `DEPLOY_ENV` - Environment the application will be deployed to. Used to report environment in Sentry.io error reports. Typically set to either "preview" or "production".
* `BANNER` - Text to display in header banner. Generally generated from `NODE_ENV`
* `BUILD_ID` - Application build ID. Generated from `CIRCLE_BRANCH`, `CIRCLE_BUILD_NUM`, and `CIRCLE_SHA1` if not set.

## License

See [LICENSE.txt](/LICENSE.txt) file for licensing details.

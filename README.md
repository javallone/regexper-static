# Regexper [![Build Status](https://travis-ci.org/javallone/regexper-static.svg?branch=react)](https://travis-ci.org/javallone/regexper-static)

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

## License

See [LICENSE.txt](/LICENSE.txt) file for licensing details.

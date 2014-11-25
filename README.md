[![Build Status](https://travis-ci.org/javallone/regexper.png)](https://travis-ci.org/javallone/regexper)

# Regexper

Code for the http://regexper.com/ site.

## Contributing

I greatly appreciate any contributions that you may have for the site. Feel free to fork the project and work on any of the reported issues, or let me know about any improvements you think would be beneficial.

When sending pull requests, please keep them focused on a single issue. I would rather deal with a dozen pull requests for a dozen issues with one change each over one pull request fixing a dozen issues. Also, I appreciate tests to be included with feature development, but for minor changes I will probably not put up much of a fuss if they're missing.

### Working with the code

Node and Ruby are required for working with this site. It is recommended to use rbenv or rvm to manage your Ruby installation, and configuration files are included to set the Ruby version and gemset.

To start with, install the necessary dependencies for Node and Ruby:

    $ bundle install
    $ npm install

There are several gulp tasks available to build various parts of the site, but to get started you only need:

    $ gulp

This will build the site into the ./build directory, start a local start on port 8080, and begin watching the source files for modifications. The site will automatically be rebuilt when files are changed. Also, if you browser has the LiveReload extension, then the page will be reloaded.

To automatically run Karma test, run the following:

    $ gulp karma

To build the site for deployment, run the following:

    $ gulp build

The site will be built into the "build" directory.

## License

See LICENSE.txt file for licensing details.

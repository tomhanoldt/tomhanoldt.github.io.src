# source for tomhanoldt.github.io Status](https://travis-ci.org/tomhanoldt/tomhanoldt.github.io.src.svg?branch=master)](https://travis-ci.org/tomhanoldt/tomhanoldt.github.io.src)

###### Supports:
  * css styling with [sass](http://sass-lang.com/documentation/file.SASS_REFERENCE.html) and pre build helpers
  * javascript development with [coffee](http://coffeescript.org/)
  * html templating with a hacked [haml-coffee](https://github.com/easy-website-generator/haml-coffee)
  * custom and predefined haml helpers

###### Uses:
  * [Easy-Website-Generator](https://github.com/easy-website-generator/)
  * [Easy-Terminal-App](https://github.com/creative-workflow/easy-terminal-app)
  * [nodejs](https://nodejs.org/en/)
  * [gulp](https://github.com/gulpjs/gulp)
  * [browser-sync](https://browsersync.io/)


### Installation
First you need to install [nodeJs](https://nodejs.org/en/download/)

##### linux/osx instructions
Just run `./app setup` and `./app serve`

##### instructions for other plattforms
```
npm install -g easy-website-generator coffee-script yarn gulp coffeelint

yarn install

# see https://github.com/sass/node-sass/issues/1804
npm rebuild node-sass

ewg serve
```

### Commandline interface
```
Usage: ./app [command] [help|*]
Available commands:
 build                  build the dist files in production mode
 clear-facebook-cache   clear the website cache for facebook/sharer/sharer.php
 deploy                 deploy the dist folder to github.io
 help                   print help
 lint                   run code linter
 serve                  serve this repo in production mode
 setup                  setup dependencies for this application
```

### Ressources
> "[Easy-Website-Generator](https://github.com/easy-website-generator/)"

> "[Creative-Workflow](http://www.creative-workflow.berlin/company.html)"

> "[Easy-Terminal-App](https://github.com/creative-workflow/easy-terminal-app)"

> "[blog.tomhanoldt.info](http://blog.tomhanoldt.info)"

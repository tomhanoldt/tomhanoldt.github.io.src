# sass-mixins [![Build Status](https://travis-ci.org/creative-workflow/sass-mixins.svg?branch=master)](https://travis-ci.org/creative-workflow/sass-mixins)

This repo contains common used sass mixins from Creativ-Workflow. There is also a little [Easy-Website-Generator](https://github.com/easy-website-generator/) app that serves the test files.

### Installation
First you need to install [nodeJs](https://nodejs.org/en/download/)

##### linux/osx instructions
Just run `./app setup` and `./app serve`

##### instructions for other plattforms
```
npm install -g easy-website-generator coffee-script yarn gulp bower

yarn install

bower install

# see https://github.com/sass/node-sass/issues/1804
npm rebuild node-sass

ewg serve
```

### Includes mixins
Look into the files to see whats happening and what you can use.
  * custom grid: `mixins/grid/variables`, `mixins/grid/mediaqueries`, `mixins/grid/grid`, `mixins/grid/classes`
  * headjs mediaqueries: `mixins/grid/headjs/mediaqueries`
  * bootstrap mediaqueries: just include `mixins/grid/mediaqueries`
  * normalization: `mixins/css/normalize`, `mixins/css/reset`
  * css3 helper: `mixins/css/css3`
  * positioning heloer: `mixins/css/positioning`
  * helper for buttons `mixins/helper/buttons`
  * helper for css arrows `mixins/helper/arrows`
  * helper for common css tasks `mixins/helper/helper`

### Commandline interface
```
Usage: ./app [command] [help|*]
 Available commands:
 build                  build the dist files in production mode
 help                   print help
 serve                  serve this repo in production mode
 setup                  setup dependencies for this application
```

### TODO
  * add phantom js and write grid tests
  * add test for helper and css

### Ressources
> "[Easy-Website-Generator](https://github.com/easy-website-generator/)"

> "[Creative-Workflow](http://www.creative-workflow.berlin/company.html)"

> "[Easy-Terminal-App](https://github.com/creative-workflow/easy-terminal-app)"

> "[blog.tomhanoldt.info](http://blog.tomhanoldt.info)"

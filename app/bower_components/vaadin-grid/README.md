![Bower version](https://img.shields.io/bower/v/vaadin-grid.svg) [![Build Status](https://travis-ci.org/vaadin/vaadin-grid.svg?branch=master)](https://travis-ci.org/vaadin/vaadin-grid) [![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/vaadin/vaadin-core-elements?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

# &lt;vaadin-grid&gt;

[&lt;vaadin-grid&gt;](https://vaadin.com/elements/-/element/vaadin-grid) is a free, high quality data grid / data table [Polymer](http://polymer-project.org) element, part of the [Vaadin Core Elements](https://vaadin.com/elements).

[<img src="https://github.com/vaadin/vaadin-grid/raw/master/screenshot.png" width="481" alt="Screenshot of vaadin-grid" />](https://vaadin.com/elements/-/element/vaadin-grid)

## Getting started

Visit https://vaadin.com/elements/-/element/vaadin-grid for features, demos and documentation.

## Contributing

See the [contribution instructions](https://github.com/vaadin/vaadin-core-elements#contributing) which apply to all Vaadin core elements.

## Development

See the [development instructions](https://github.com/vaadin/vaadin-core-elements#development) which apply to all Vaadin core elements.

### &lt;vaadin-grid&gt; specific development instructions

The internal implementation of vaadin-grid (1.0) is written in [GWT](http://gwtproject.org), as it is based on the same implementation which is used in [Vaadin Framework 7](https://vaadin.com/framework).

Below are instructions how to work with the GWT/Java code:

#### Compiling the GWT module

The compiled module is in the repository (`vaadin-grid.min.js`), so you don't need to compile it unless you modify any `.java` files.

First, make sure you've installed all the necessary tooling:
- [Node.js](http://nodejs.org)
- [JDK8](http://www.oracle.com/technetwork/java/javase/downloads/index.html)
- [Maven](http://maven.apache.org/download.cgi)

Install [Gulp](http://gulpjs.com):

```shell
$ npm install -g gulp
```

Install npm dependencies:

```shell
$ npm install
```

Run the GWT compilation:

```shell
$ gulp gwt
```

Compiling using "pretty" output:
```shell
$ gulp gwt --gwt-pretty
```

#### Running and debugging in GWT SuperDevMode

To easily debug the Java code in the browser, use SDM:
```shell
$ gulp gwt:sdm
```


## License

Apache License 2.0

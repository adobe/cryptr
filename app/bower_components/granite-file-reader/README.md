# granite-file-reader

> A lightweight element to read a file from the filesystem
> 
> Polymer 1.5 ready

## Doc & demo

[https://lostinbrittany.github.io/granite-file-reader](https://lostinbrittany.github.io/granite-file-reader)

## Install

Install the component using [Bower](http://bower.io/):

```sh
$ bower install LostInBrittany/granite-file-reader --save
```

Or [download as ZIP](https://github.com/LostInBrittany/granite-file-reader/archive/gh-pages.zip).## Usage

1. Import Web Components' polyfill (if needed):

    ```html
    <script src="bower_components/webcomponentsjs/webcomponents.min.js"></script>
    ```

2. Import Custom Element:

    ```html
    <link rel="import" href="bower_components/granite-file-reader/granite-file-reader.html">
    ```

3. Start using it!

    ```html
    <granite-file-reader read-as="dataURL" accept=".txt,.html,.css,.sh">
        <div class="clickHere">Click here to load a file</div>
    </granite-file-reader>
    ```


## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## License

[MIT License](http://opensource.org/licenses/MIT)
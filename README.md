# react-native-static-html-to-pdf

Convert static html file to pdf

This library is inspired by [react-native-html-to-pdf](https://github.com/christopherdro/react-native-html-to-pdf). It takes a static html file as parameter (whereas react-native-html-to-pdf takes a string as argument).

It takes a screenshot of the page before redirection to `target`. So you need to add in your html file the following script at the end of the execution of your js

```js
window.location.href = 'http://finishload.com';
```

The returned value is the path of the generated pdf file

## Installation

```sh
npm install react-native-static-html-to-pdf
```

## Usage

```js
import { generatePdf } from 'react-native-static-html-to-pdf';

// ...

const pathOfGeneratedPdf = await generatePdf({
  path: `${DocumentDirectoryPath}/public/index.html`,
  target: 'http://finishload.com',
  documentName: 'file.pdf',
  width: 612,
  height: 792,
});
```

where

| param        | description                                        | example                                                                                          |
| ------------ | -------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| path         | path to your html file                             | `${DocumentDirectoryPath}/index.html` (_DocumentDirectoryPath_ is provided by `react-native-fs`) |
| target       | url used to indicate that js execution is finished | `http://finishload.com`                                                                          |
| documentName | name of the generated pdf (in cache directory)     | `file.pdf`                                                                                       |
| width        | width of the generated pdf                         | 612                                                                                              |
| height       | height of the generated pdf                        | 792                                                                                              |

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

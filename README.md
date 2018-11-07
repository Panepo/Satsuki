# [Satsuki](https://panepo.github.io/Satsuki/)

[![Build Status](https://travis-ci.org/Panepo/Satsuki.svg?branch=master)](https://travis-ci.org/Panepo/Satsuki.svg) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

React implementation of image fast style transfer

## FAQ

### What is this?

This is an implementation of the Fast Neural Style Transfer algorithm running purely on the browser using the Tensorflow.js library. Basically, a neural network attempts to "draw" one picture from the image you uploaded in the style of another.

### Is my data safe?

Your data and pictures here never leave your computer! In fact, this is one of the main advantages of running neural networks in your browser. Instead of sending us your data, we send you both the model and the code to run the model. These are then run by your browser.

### How big are the models I'm downloading?

For each available style, your browser will download a model around ~6.6MB in size. Be careful if you have limited bandwidth (mobile data users). Besides The Gleaner by Miller style, all other models will be downloaded once you click them.

## Requirements

* Browser (Chrome is perfered)
* Image for style transfer or a webcam

## Usage

First visit this [page](https://panepo.github.io/Satsuki/) and follow these steps:

![usage](https://github.com/Panepo/Satsuki/blob/master/doc/usage.png)

1. Upload the images
   (note that the image will resize to 256x256 to fit neural network input.)
2. Choice one of the styles
2. Click transfer

## Results

Here are the results. From left to right, the first column is the input image, the second to sixth image are style-transfered image.

<img src="https://github.com/Panepo/Satsuki/blob/master/doc/black0.png" alt="black0" height="256" width="256"> <img src="https://github.com/Panepo/Satsuki/blob/master/doc/black1.png" alt="black1" height="256" width="256"> <img src="https://github.com/Panepo/Satsuki/blob/master/doc/black2.png" alt="black2" height="256" width="256">

<img src="https://github.com/Panepo/Satsuki/blob/master/doc/black3.png" alt="black3" height="256" width="256"> <img src="https://github.com/Panepo/Satsuki/blob/master/doc/black4.png" alt="black4" height="256" width="256"> <img src="https://github.com/Panepo/Satsuki/blob/master/doc/black5.png" alt="black5" height="256" width="256">

<img src="https://github.com/Panepo/Satsuki/blob/master/doc/black20.png" alt="black0" height="256" width="256"> <img src="https://github.com/Panepo/Satsuki/blob/master/doc/black21.png" alt="black1" height="256" width="256"> <img src="https://github.com/Panepo/Satsuki/blob/master/doc/black22.png" alt="black2" height="256" width="256">

<img src="https://github.com/Panepo/Satsuki/blob/master/doc/black23.png" alt="black3" height="256" width="256"> <img src="https://github.com/Panepo/Satsuki/blob/master/doc/black24.png" alt="black4" height="256" width="256"> <img src="https://github.com/Panepo/Satsuki/blob/master/doc/black25.png" alt="black5" height="256" width="256">

## Reference

* [A Neural Algorithm of Artistic Style](https://arxiv.org/abs/1508.06576)
* [Perceptual Losses for Real-Time Style Transfer and Super-Resolution](https://arxiv.org/abs/1603.08155)
* [Fast Style Transfer in TensorFlow](https://github.com/lengstrom/fast-style-transfer)
* [Fast Neural Style Transfer in browser with deeplearn.js](https://github.com/reiinakano/fast-style-transfer-deeplearnjs)
* [zaidalyafeai](https://github.com/zaidalyafeai/zaidalyafeai.github.io)

## Library used

* [Tensorflow](https://www.tensorflow.org/)
* [Tensorflow.js](https://js.tensorflow.org/)
* [Keras](https://github.com/keras-team/keras)
* [React](https://facebook.github.io/react/)
* [Redux](http://redux.js.org/)
* [Create React App](https://github.com/facebook/create-react-app)
* [Material Design Lite](https://getmdl.io/)
* [Material-UI](https://material-ui.com/)
* [react-webcam](https://github.com/mozmorris/react-webcam)

## Develop

### Development Requirements
* node `^8.11.0`
* yarn `^1.7.0`

### Getting Start

1. Clone source code
```
$ git clone https://github.com/Panepo/Satsuki.git
```
2. Install dependencies
```
$ cd Satsuki
$ yarn
```
3. Start development server and visit [http://localhost:3000/](http://localhost:3000/)
```
$ yarn start
```
### Scripts

|`yarn <script>`       |Description|
|-------------------|-----------|
|`start`            |Serves your app at `localhost:3000`|
|`test`             |Run test code in ./src|
|`lint`             |Lint code in ./src|
|`prettier`         |Prettier code in ./src|
|`build`            |Builds the production application to ./build|
|`deploy`           |Deploy the production application to github pages|

### Testing

Jest is used for test runner. Jest will look for test files with any of the following naming conventions:

* Files with `.js` suffix in `__tests__` folders.
* Files with `.test.js` suffix.
* Files with `.spec.js` suffix.

Jest has an integrated coverage reporter that works well with ES6 and requires no configuration.
Run `npm test -- --coverage` (note extra `--` in the middle) to include a coverage report.

### Production

Build code before deployment by running `yarn build`.

## Author

[Panepo](https://github.com/Panepo)

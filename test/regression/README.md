# test/regression

this is where the visual regression testing happens

this relies primarily on two things:

1. headless chrome via [puppeteer](https://github.com/GoogleChrome/puppeteer/blob/v1.10.0/docs/api.md) for browser-ing and screenshot-ing 

2. [resemble.js](https://github.com/HuddleEng/Resemble.js) for visual diffs.

tests written in [tape](https://medium.com/javascript-scene/why-i-use-tape-instead-of-mocha-so-should-you-6aa105d8eaf4)

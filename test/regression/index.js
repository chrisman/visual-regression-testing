const tape = require('tape');
const puppeteer = require('puppeteer');
const compareImages = require('resemblejs/compareImages');
const fs = require('mz/fs');

const url = 'http://localhost:8000';
const path = 'test/regression'
const dirs = {
  blessed: 'blessedImages',
  diffs: 'diffs',
  test: 'screenshots',
}
const screensizes = [
  '800x600',
  '768x1024', // iPad
  '375x812',  // iPhone X/XS
];
const compareImagesOptions = {
  output: {
    errorColor: {
      red: 255,
      green: 0,
      blue: 255
    },
    errorType: "movement",
    transparency: 0.3,
    largeImageThreshold: 1200,
    useCrossOrigin: false,
    outputDiff: true
  },
  scaleToSameSize: true,
  ignore: "antialiasing"
};

//helper functions
const asyncWrapper = (run) => (test) => {
  try {
    Promise.resolve(run(test)).then(
      function() { test.end(); },
      function(error) { 
        console.error('the error is', error);
        test.end(error || new Error('rejected'));
      }
    );
  } catch(error) {
    test.end(error);
  }
}
const test = (desciption, run) => {
  return tape(desciption, asyncWrapper(run));
}

//tests
test("async test", async t => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  t.ok(true);
});

test("index", async t => {
  screensizes.forEach(async screensize => {
    const filename = `${screensize}/index`;
    const [ width, height ] = screensize
      .split('x')
      .map(str => Number(str));

    const browser  = await puppeteer.launch();
    const page     = await browser.newPage();

    await page.setViewport({ width, height })
    await page.goto(url);
    await page.screenshot({
      path: `${path}/${dirs.test}/${filename}.png`,
      fullPage: true,
    });

    await browser.close();

    const [ screenshot, blessed ] = await Promise.all([
      await fs.readFile(`./${path}/${dirs.blessed}/${filename}.png`),
      await fs.readFile(`./${path}/${dirs.test}/${filename}.png`)
    ]);

    const diff = await compareImages(screenshot, blessed, compareImagesOptions);

    await fs.writeFile(`${path}/${dirs.diffs}/${filename}.png`, diff.getBuffer());

    const ACTUAL = Number(diff.misMatchPercentage);
    const EXPECTED = 0;
    t.equal(ACTUAL, EXPECTED, `${screensize}/index is off by ${ACTUAL}%`);
  });
});

const tape = require('tape');
const puppeteer = require('puppeteer');
const compareImages = require('resemblejs/compareImages');
const fs = require('mz/fs');

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

tape.skip("promises are great", async t => {
  await new Promise(resolve => setTimeout(resolve, 1000));

  t.ok(true);
});

test("puppeteer", async t => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const route = undefined;
  const screensize = '800x600';
  const screenshotDir = 'test/regression/screenshots';
  const filename = `${screensize}/${route || 'index'}`;
  //const url = 'http://localhost:3000';
  const url = 'https://example.com';

  await page.goto(`${url}/${route || 'index'}`);
  await page.screenshot({
    path: `${screenshotDir}/${filename}.png`
  });

  await browser.close();

  const options = {
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

  const [ screenshot, blessed ] = await Promise.all([
    await fs.readFile('./test/regression/blessedImages/800x600/index.png'),
    await fs.readFile('./test/regression/screenshots/800x600/index.png')
  ]);

  const data = await compareImages(screenshot, blessed, options);

  await fs.writeFile(`test/regression/diffs/800x600/index.png`, data.getBuffer());

  const ACTUAL = Number(data.misMatchPercentage);
  const EXPECTED = 0;
  t.equal(ACTUAL, EXPECTED);
});

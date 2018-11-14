-   [visual regression testing](#visual-regression-testing)
    -   [ℹ️ about](#ℹ-about)
    -   [🙇‍♂️ How?](#how)
    -   [💻 example terminal output](#example-terminal-output)
    -   [📷 example visual output](#example-visual-output)
    -   [🏃‍♀️ Run it](#run-it)
    -   [🛠 TODO](#todo)

visual regression testing
=========================

aka <abbr title="California Style Sheets">CSS</abbr> Regression Testing

A very contrived proof-of-concept

ℹ️ about
--------

*visual regression testing* is a funny weird cool little thing where you
use a headless browser to load up and take screenshots of your website
after you make changes to your CSS or whatever.

Then you use a visual diffing utility to compare those new "real world"
screenshots to a collection of "blessed" or approved or canonical
screenshots that you already have from designs or mockups or from
previous versions of the site.

for example, here is the layout of the `test` directory after testing
one route ('/' or "index") at three screen sizes (iPhone, iPad, and
800x600):

    .
    └── test
        └── regression
            ├── blessedImages
            │   ├── 375x812
            │   │   └── index.png
            │   ├── 768x1024
            │   │   └── index.png
            │   └── 800x600
            │       └── index.png
            ├── diffs
            │   ├── 375x812
            │   │   └── index.png
            │   ├── 768x1024
            │   │   └── index.png
            │   └── 800x600
            │       └── index.png
            ├── index.js
            └── screenshots
                ├── 375x812
                │   └── index.png
                ├── 768x1024
                │   └── index.png
                └── 800x600
                    └── index.png

Using <abbr title="Visual Regression Testing">VRT</abbr> you will be
notified whether that <abbr title="California Style Sheets">CSS</abbr>
rule you just tweaked also made changes on other pages in your project,
and you will also have a visual representation of what has changed.

this work is inspired by a talk [Emily
Morehouse](https://twitter.com/emilyemorehouse/status/1011324145542418432)
gave at [dinosaurjs](https://twitter.com/dinosaur_js) 2018.

🙇‍♂️ How?
---------

This example relies primarily on two things, and then a third thing:

1.  headless chrome via
    [puppeteer](https://github.com/GoogleChrome/puppeteer/blob/v1.10.0/docs/api.md)
    for browser-ing and screenshot-ing

2.  [resemble.js](https://github.com/HuddleEng/Resemble.js) for visual
    diffs.

3.  [tape](https://medium.com/javascript-scene/why-i-use-tape-instead-of-mocha-so-should-you-6aa105d8eaf4)
    for writing tests.

💻 example terminal output
-------------------------

You'll start by running your tests in the terminal. (Ideally automated
as part of a githook.) So what does it look like to run the tests?

The below examples are using `tap-nyan` to filter the TAP output because
`tap-nyan` is both terse (we don't need the full stack trace here) but
also has a nyan cat: it's the best of both worlds!

Here's what running a passing regression test looks like on the '/'
route with three different screen sizes.

    ⇒  yarn run test/regression
    yarn run v1.12.3
    $ node test/regression | tap-nyan
     3   -_-_,------,
     0   -_-_|   /\_/\
     0   -_-^|__( ^ .^)
         -_-  ""  ""
      Pass!
    ✨  Done in 3.65s.

Here's what the failing example from the previous section looks like.

    ⇒  yarn run test/regression
    yarn run v1.12.3
    $ node test/regression | tap-nyan
     0   -_-_,------,
     3   -_-_|   /\_/\
     0   -_-^|__( x .x)
         -_-  ""  ""
      Failed Tests: There were 3 failures

        ✗ # index
    : 768x1024/index is off by 4.3%. see: test/regression/diffs/768x1024/index.png
        ✗ # index
    : 800x600/index is off by 5.13%. see: test/regression/diffs/800x600/index.png
        ✗ # index
    : 375x812/index is off by 3.09%. see: test/regression/diffs/375x812/index.png
    ✨  Done in 3.72s.

Oof, poor nyan-cat. Okay so there are failures. What do you do with that
information? Let's look at the diffs.

📷 example visual output
-----------------------

After your tests have failed, you probably want to see what caused the
failure. That's the whole point of this set up: to have a visual relic
of the difference between how the page looks and how you think it
*should* look.

Here's a "blessed" screenshot of the sample page. It's either a
screenshot from a previous approved version of the site, or maybe it's a
mockup from your design team that you're building the site out against.
No matter the case, it's your goal for your site to visually match this
image. It's your holy grail. It's your pot of gold at the end of the
rainbow, the stuff of your dreams.

![first image](docs/first.png)

Here's a screenshot of the site that was just taken. It is not "blessed"
but it's not necessarily cursed either. The point is we don't know it's state.
All we know is that it's what the site looks like right now, and that you want
to measure its conformity to the "blessed" version of the same page.

There is a slight difference between this screenshot and the "blessed"
one. You may not be able to see it. But it is there, I promise.

![second image](docs/second.png)

Don't believe me? Well here's the pudding in which the proof lies: the visual
diff of these two images, in which you can see incontrovertible evidence of the
results of the extra padding applied to the element.

![third image](docs/third.png)

🏃‍♀️ Run it
-----------

1.  `yarn` -- install deps

2.  `yarn run dev` -- you need a server running so the tests can visit
    your site

3.  `yarn run test/regression` -- run the tests

🛠 TODO
------

0.  every new change to the site will cause tests to fail unless every
    new change to the site is accompanied by a change to your collection
    of blessed images. there should be a way to make this less painful.
    perhaps a utility to force the test to pass by copying the new
    screenshot to the appropriate corresponding spot in `blessedImages`.

    Reverse engineer this output:

    ```
    800x600/index is off by 5.13%. see: test/regression/diffs/800x600/index.png
    approve changes and copy test/regression/screenshots/800x600/index.png to test/regression/blessedImages/800x600/ [yN]:
    ```

1.  right now if you add a new screen size the tests will crash when fs
    tries to open a directory that isn't there. some kind of `beforeAll`
    check that creates the necessary file structures before trying to
    access them should fix this.

2.  fix the question of when to run regressions. is this a pre-commit
    githook? a pre-push?

3.  make a nicer way to add routes to the test suite.

4.  ???

<!-- 
Off topic:

Calling CSS "California Style Sheets" is a joke that I stole from Jenn Schiffer
and it's something I do every time I have the chance to so that I can link back
to her magnificent talk.

https://youtu.be/wewAC5X_CZ8?t=163
//-->

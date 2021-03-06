# MarkUp readme

MarkUp is a chrome extension that allows users to mark up the internet with stickers while tagging their friends in the fun.

### Video Demonstration!

- Check it out [here](https://www.youtube.com/watch?v=s693cWLZf-0&feature=youtu.be)!

### Screenshot

![image info](./images/screencap2.png)

# Setup

- Requires Chrome browser ([download][chromelink]).

### Installing on Chrome

- [Installation Video](https://youtu.be/osVr5s_OV-Q)!
- Download the production version of this repo as a [zip file](https://drive.google.com/file/d/1D5tYmUUFfnZPVMONDHyT0HwBI310FSB0/view?usp=sharing).
- Unzip the repository on your local system.
- In the chrome browser, go to the extensions page: [chrome://extensions][extensionspage]
- Activate developer mode (button in top right of window).
- Click "load unpacked" in the top left, and select the unzipped MarkUp folder.
- Voila! You now have the extension installed in your browser.

### Dependencies

- [React] - front-end framework for the popup.
- [Seqelize] - ORM for working with relational databases such as PostgreSQL.
- [Webpack] - bundles popup scripts, content scripts, and background scripts into their respective bundles.
- [node.js] - evented I/O for the backend
- [Express] - fast node.js network app framework [@tjholowaychuk]
- [Axios] - promise based http client for browser / node.js
- There are more...

### Getting Started

- Click the MarkUp icon to open the extension popup
- On the myStickers tab, click "addSticker" to add a sticker to a webpage
- On the friends tab, search for your friends by their userName and add them as friends
- Try adding a sticker and using the @ tag to tag one of your friends by their username (e.g. "check out this website @nicky")

### Team

- Nicky Spiva (me!) ~ solo project currently.

## Errors and bugs

If something is not behaving intuitively, it is a bug and should be reported.
Report it here by creating an issue: https://github.com/nickspiva/MarkUp/issues

Help me fix the problem as quickly as possible by following [Mozilla's guidelines for reporting bugs.](https://developer.mozilla.org/en-US/docs/Mozilla/QA/Bug_writing_guidelines#General_Outline_of_a_Bug_Report)

## Patches and pull requests

Your patches are welcome. Here's my suggested workflow:

- Fork the project.
- Make your feature addition or bug fix.
- Send me a pull request with a description of your work.

  [chromeLink]: <https://www.google.com/chrome/?brand=CHBD&gclid=Cj0KCQjwoub3BRC6ARIsABGhnyYAVyBfAvqjg3BySoppYwhUPkPBvMLxY_kBGWhdHmMza5t-U3pjm2oaAjGSEALw_wcB&gclsrc=aw.ds>
  [extensionsPage]: <chrome://extensions>

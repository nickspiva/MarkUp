const puppeteer = require("puppeteer");
const assert = require("assert");
const extensionPath = require("path").join(
  __dirname,
  "../../MarkUp-publication"
);

console.log("extensionPath: ", extensionPath);

let extensionPage = null;
let browser = null;

describe("Popup Page", async function () {
  this.timeout(20000);
  before(async function () {
    await boot();
  });

  it("popup loads", async function () {
    const navbarElement = document.getElementById("navbar");
    console.log("navbar: ", navbarElement);
    assert.ok(navbarElement, "Navbar is not rendered");
  });
});

async function boot() {
  browser = await puppeteer.launch({
    headless: false,
    args: [
      `--disable-extensions-except=${extensionPath}`,
      `--load-extension=${extensionPath}`,
    ],
  });
  const dummyPage = await browser.newPage();
  await dummyPage.waitFor(2000);

  const extensionName = "MarkUp Extension";

  const targets = await browser.targets();
  const extensionTarget = targets.find(({ _targetInfo }) => {
    return (
      _targetInfo.title === extensionName &&
      targetInfo.type === "background_page"
    );
  });
  const extensionUrl = extensionTarget._targetInfo.url || "";
  const [, , extensionId] = extensionUrl.split("/");

  const extensionPopupHtml = "popup.html";
  extensionPage = await browser.newPage();
  await extensionPage.goto(
    `chrome-extension://${extensionId}/${extensionPopupHtml}`
  );
}

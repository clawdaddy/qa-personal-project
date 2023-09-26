import {
  Builder,
  By,
  Capabilities,
  until,
  WebDriver,
  WebElement,
  Actions,
} from "selenium-webdriver";
const chromedriver = require("chromedriver");

interface Options {
  driver?: WebDriver;
  url?: string;
}

export class BasePage {
  driver: WebDriver;
  url: string;
  constructor(options?: Options) {
    if (options && options.driver) this.driver = options.driver;
    else
      this.driver = new Builder()
        .withCapabilities(Capabilities.chrome())
        .build();
    if (options && options.url) this.url = options.url;
  }
  async navigate(url?: string): Promise<void> {
    if (url) return await this.driver.get(url);
    else if (this.url) return await this.driver.get(this.url);
    else
      return Promise.reject(
        "Url needs to be given in the test or the page object"
      );
  }
  async getElement(elementBy: By): Promise<WebElement> {
    await this.driver.wait(until.elementLocated(elementBy));
    let element = await this.driver.findElement(elementBy);
    await this.driver.wait(until.elementIsVisible(element));
    return element;
  }
  async getElements(elementBy: By) {
    await this.driver.wait(until.elementsLocated(elementBy));
    const elements = await this.driver.findElements(elementBy);
    await this.driver.wait(until.elementIsVisible(elements[0]));
    return elements;
  }
  async click(elementBy: By): Promise<void> {
    return (await this.getElement(elementBy)).click();
  }
  async setInput(elementBy: By, keys: any): Promise<void> {
    let input = await this.getElement(elementBy);
    await input.clear();
    return input.sendKeys(keys);
  }
  async getText(elementBy: By): Promise<string> {
    return (await this.getElement(elementBy)).getText();
  }
  async getTexts(elementBy: By) {
    return Promise.all(
      (await this.getElements(elementBy)).map((element) => element.getText())
    );
  }
  async getAttribute(elementBy: By, attribute: string): Promise<string> {
    return (await this.getElement(elementBy)).getAttribute(attribute);
  }
  async getAttributes(elementBy: By, attribute: string) {
    return Promise.all(
      (await this.getElements(elementBy)).map((element) =>
        element.getAttribute(attribute)
      )
    );
  }
  actionWiggle(
    actions: Actions,
    originElement: WebElement,
    moveDurationMS: number = 100
  ): Actions {
    return actions
      .move({ origin: originElement, duration: moveDurationMS })
      .move({ origin: originElement, x: 10, y: 0, duration: moveDurationMS })
      .move({ origin: originElement, x: 0, y: 10, duration: moveDurationMS })
      .move({ origin: originElement, x: 10, y: 0, duration: moveDurationMS })
      .move({ origin: originElement, x: 0, y: 10, duration: moveDurationMS })
      .pause(moveDurationMS);
  }
  async sendKeys(elementBy: By, keys: any) {
    await this.driver.wait(until.elementLocated(elementBy)).clear();
    return this.driver.findElement(elementBy).sendKeys(keys);
  }
}

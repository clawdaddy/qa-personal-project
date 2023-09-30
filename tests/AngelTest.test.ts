import { AngelPage } from "../pages/AngelPage";
import { until } from "selenium-webdriver";

const page = new AngelPage();

describe("tests for angel.com", () => {
  beforeAll(async () => {
    await page.navigate();
  }, 30000);
  afterAll(async () => {
    await page.driver.quit();
  });
  test("user can navigate to the watch content using navigation bar", async () => {
    await page.click(page.closePopupBtn);
    const navButton = await page.getElement(page.watchNavigationBtn);
    await navButton.click();
    const header = await page.getText(page.startWatchingTitle);
    expect(header).toBe("Start Watching");
  });
  test("carousel can move forward on button click and returns to first ad when it reaches the end", async () => {
    // it takes 7 clicks to get through the carousel
    const startingHref = await page.getBannerHref(page.currentSlide);
    await page.clickCarouselBtn(page.carouselRightBtn);
    await page.driver.sleep(500);
    await page.clickCarouselBtn(page.carouselRightBtn);
    await page.driver.sleep(500);
    await page.clickCarouselBtn(page.carouselRightBtn);
    const midHref = await page.getBannerHref(page.currentSlide);
    expect(startingHref).not.toBe(midHref);

    await page.driver.sleep(500);
    await page.clickCarouselBtn(page.carouselRightBtn);
    await page.driver.sleep(500);
    await page.clickCarouselBtn(page.carouselRightBtn);
    await page.driver.sleep(500);
    await page.clickCarouselBtn(page.carouselRightBtn);
    await page.driver.sleep(500);
    await page.clickCarouselBtn(page.carouselRightBtn);
    await page.driver.sleep(500);
    const finalHref = await page.getBannerHref(page.currentSlide);

    expect(startingHref).toEqual(finalHref);
  });
  test("carousel can move backward on left button click and cycles back to the beginning", async () => {
    const startingHref = await page.getBannerHref(page.currentSlide);
    await page.clickCarouselBtn(page.carouselLeftBtn);
    await page.driver.sleep(500);
    await page.clickCarouselBtn(page.carouselLeftBtn);
    await page.driver.sleep(500);
    await page.clickCarouselBtn(page.carouselLeftBtn);
    const midHref = await page.getBannerHref(page.currentSlide);
    expect(startingHref).not.toBe(midHref);

    await page.driver.sleep(500);
    await page.clickCarouselBtn(page.carouselLeftBtn);
    await page.driver.sleep(500);
    await page.clickCarouselBtn(page.carouselLeftBtn);
    await page.driver.sleep(500);
    await page.clickCarouselBtn(page.carouselLeftBtn);
    await page.driver.sleep(500);
    await page.clickCarouselBtn(page.carouselLeftBtn);
    await page.driver.sleep(500);
    const finalHref = await page.getBannerHref(page.currentSlide);

    expect(startingHref).toEqual(finalHref);
  });
  //   show overview
  test("selecting a show navigates user to overview of show (Dry Bar Comedy)", async () => {
    const slider = await page.driver.findElement(page.ourShowsSlider);
    await page.driver.actions().move({ origin: slider }).perform();
    await page.clickCarouselBtn(page.ourShowsRightBtn);
    await page.driver.wait(until.elementLocated(page.dryBarPanel));
    const dryBar = await page.driver.findElement(page.dryBarPanel);
    await page.driver.sleep(500);
    await dryBar.click();
    const header = await page.getText(page.dryBarTitle);
    expect(header).toBe("Dry Bar Comedy");
  });

  //   video player
  test("can start a video from overview", async () => {
    await page.click(page.watchNowBtn);
    const subPlayerTitle = await page.getText(page.subPlayerTitle);
    expect(subPlayerTitle).toMatch("Dry");
    await page.driver.sleep(2500);
    const bigPause = await page.getElement(page.bigPauseBtn);
    // await page.driver.wait(until.elementIsVisible(page.bigPauseBtn));

    // const bigPlayPauseBtn = await page.getElement(page.bigPlayPauseBtn);
  }, 25000);
  test("video can skip forward 10 seconds", async () => {
    const progressTracker = await page.getElement(page.progressTracker);
    await page.driver.wait(until.elementTextContains(progressTracker, "00:02"));
    const startTime = new Date().getSeconds();
    await page.click(page.skipForwardBtn);
    await page.driver.wait(until.elementTextContains(progressTracker, "00:12"));
    const secondTime = await new Date().getSeconds();

    const withinParams = page.isTimeCorrect(secondTime, startTime);
    expect(withinParams).toBe(true);
  });
  test("video can skip back 10 seconds", async () => {
    const progressTracker = await page.getElement(page.progressTracker);
    await page.driver.wait(until.elementTextContains(progressTracker, "00:13"));
    const startTime = new Date().getSeconds();
    await page.click(page.skipBackBtn);
    await page.driver.wait(until.elementTextContains(progressTracker, "00:03"));
    const secondTime = new Date().getSeconds();
    const withinParams = page.isTimeCorrect(secondTime, startTime);
    expect(withinParams).toBe(true);
  });
  test("video can be played at 2x speed", async () => {
    const progressTracker = await page.getElement(page.progressTracker);
    await page.driver.wait(until.elementTextContains(progressTracker, "00:05"));
    await page.click(page.settingsButton);
    await page.click(page.playbackSpeedSelectBox);
    await page.click(page.doubleSpeedOption);
    const startTime = new Date().getSeconds();
    await page.driver.wait(until.elementTextContains(progressTracker, "00:15"));
    const endTime = new Date().getSeconds();
    const diff = endTime - startTime;
    expect(diff).toBeLessThanOrEqual(6);
  });
});

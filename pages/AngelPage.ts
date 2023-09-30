import { By, WebElement } from "selenium-webdriver";

import { BasePage } from "./BasePage";

export class AngelPage extends BasePage {
  constructor() {
    super({ url: "https://stg.angel.com/" });
  }

  watchNavigationBtn = By.css('a.btn[href="/watch"]');
  startWatchingTitle = By.xpath('//h3[text()="Start Watching"]');
  closePopupBtn = By.className("osano-cm-dialog__close");
  //   banner carousel
  currentSlide = By.css(".mb-16 .slick-active.slick-current a");
  carouselRightBtn = By.css(".slick-slider .right-0");
  carouselLeftBtn = By.css(".slick-slider .left-0.cursor-pointer");
  bannerLink = By.xpath("//a");

  //   "Our Shows" carousel
  ourShowsSlider = By.id("start-watching");
  ourShowsRightBtn = By.css("#start-watching .right-2");
  dryBarPanel = By.css('#start-watching div[title~="Dry"] a');
  //   Dry Bar Overview
  dryBarTitle = By.xpath('//h1[text()="Dry Bar Comedy"]');
  watchNowBtn = By.id("watch-now");

  //   video
  skipBackBtn = By.className("bmpui-ui-skipbackwardbutton");
  bigPlayPauseBtn = By.className("bmpui-ui-hugeplaybacktoggle");
  bigPlayBtn = By.css(".bmpui-ui-hugeplaybacktogglebutton.bmpui-off");
  bigPauseBtn = By.css(".bmpui-ui-hugeplaybacktogglebutton.bmpui-on");
  skipForwardBtn = By.className("bmpui-ui-skipforwardbutton");
  smallPlayPauseBtn = By.className("bmpui-ui-playbacktogglebutton");
  progressTracker = By.className("bmpui-progress-label");
  videoTitle = By.className("bmpui-ui-titlebar");
  subPlayerTitle = By.xpath('//p[@aria-label="player-episode-mapping"]');
  settingsButton = By.className("bmpui-ui-settingstogglebutton");
  playbackSpeedSelectBox = By.className("bmpui-ui-playbackspeedselectbox");
  doubleSpeedOption = By.xpath('//option[@value="2"]');

  async clickCarouselBtn(elementBy: By) {
    const btn = await this.driver.findElement(elementBy);
    return btn.click();
  }
  async getBannerHref(elementBy: By) {
    return (await this.getElement(elementBy)).getAttribute("href");
  }
  async getTimeElapsed() {
    const progressText = await this.getText(this.progressTracker);
    return +progressText.substring(3, 4);
  }
  isTimeCorrect(laterTime: number, earlierTime: number) {
    const diff = laterTime - earlierTime;
    if (diff >= 0 && diff < 2) {
      return true;
    }
    return false;
  }
}

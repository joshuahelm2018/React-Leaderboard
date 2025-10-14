import { By, until } from 'selenium-webdriver';

export default class LeaderboardPage {
    constructor(driver) {
        this.driver = driver;
        this.url = 'http://localhost';
        this.timeout = 5000;
    }

    get title() {
        return By.css('h1');
    }

    get scoreTimes() {
        return By.css('ul li div.score-time');
    }

    get prevBtn() {
        return By.xpath("//button[contains(text(), '⬅')]");
    }

    get nextBtn() {
        return By.xpath("//button[contains(text(), '➡')]");
    }

    async open(mission_id) {
        if (mission_id) {
            await this.driver.get(`${this.url}/?mission_id=${mission_id}`);
        } else {
            await this.driver.get(this.url);
        }
    }

    async getTitleText() {
        await this.driver.wait(until.elementLocated(this.title), this.timeout);
        return this.driver.findElement(this.title).getText();
    }

    async getScoresTimesText() {
        const scores = await this.driver.wait(until.elementsLocated(this.scoreTimes), this.timeout);
        const texts = [];
        for (const s of scores) {
          texts.push(await s.getText());
        }
        return texts;
    }

    async clickPrevBtn() {
        const prevBtn = await this.driver.findElement(this.prevBtn);
        await prevBtn.click();
    }

    async clickNextBtn() {
        const nextBtn = await this.driver.findElement(this.nextBtn);
        await nextBtn.click();
    }

    async getLastMissionId() {
        const response = await fetch(`${this.url}:4000/missions`);
        const missions = await response.json();
        const lastMissionId = missions.length > 0 ? missions[missions.length - 1].id : 1;

        return lastMissionId;
    }
}
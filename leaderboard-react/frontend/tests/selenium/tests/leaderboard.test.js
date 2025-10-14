import { Builder } from 'selenium-webdriver';
import firefox from 'selenium-webdriver/firefox.js';
import { expect } from 'chai';
import LeaderboardPage from '../pages/leaderboard-page.js';

describe('Leaderboard Page', function() {
    this.timeout(20000);

    let driver
    let leaderboard;

    before(async function() {
        const options = new firefox.Options();
        options.addArguments('--headless');
        driver = await new Builder().forBrowser('firefox').setFirefoxOptions(options).build();
        leaderboard = new LeaderboardPage(driver);
    });

    after(async function() {
        await driver.quit();
    });

    it('displays a title with mission ID', async function() {
        await leaderboard.open();
        const title = await leaderboard.getTitleText();
        expect(title).to.match(/^\d+ - .*/, 'Title format is "ID - Name"');
    });

    it('scores in hh:mm format', async function() {
        await leaderboard.open();
        const scores = await leaderboard.getScoresTimesText();

        for (const score of scores) {
            expect(score).to.match(/^([0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/);
        }
    });

    function timeToSeconds(timeStr) {
      const [minutes, seconds] = timeStr.split(':').map(Number);
      return minutes * 60 + seconds;
    }

    it('scores are sorted by time ascending', async function() {
        await leaderboard.open();
        const scores = await leaderboard.getScoresTimesText();

        const timesInSeconds = scores.map(timeToSeconds);

        for (let i = 0; i < timesInSeconds.length - 1; i++) {
            expect(timesInSeconds[i], `Score at index ${i} is greater than next`).to.be.at.most(timesInSeconds[i + 1]);
        }
    });

    it('can load specified mission id', async function() {
        await leaderboard.open(1);
        const firstTitle = await leaderboard.getTitleText();
        expect(firstTitle).to.match(/^1 - .*/);

        let min = 2;
        let max = await leaderboard.getLastMissionId();
        let randMission = Math.floor(Math.random() * (max - min + 1)) + min;
        console.log(`random mission: ${randMission}`);

        await leaderboard.open(randMission);
        const secondTitle = await leaderboard.getTitleText();
        expect(secondTitle).to.match(new RegExp(`^${randMission} - .*`));
    });

    it('previous button does not decrement when on first mission', async function() {
        await leaderboard.open();

        const firstTitle = await leaderboard.getTitleText();
        await leaderboard.clickPrevBtn();
        const afterTitle = await leaderboard.getTitleText();
        expect(afterTitle).to.match(new RegExp(firstTitle));
    });

    it('next button does not increase when on last mission', async function() {
        await leaderboard.open(await leaderboard.getLastMissionId());

        const firstTitle = await leaderboard.getTitleText();
        await leaderboard.clickNextBtn();
        const afterTitle = await leaderboard.getTitleText();
        expect(afterTitle).to.match(new RegExp(firstTitle));
    });
});

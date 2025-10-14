import { test, expect } from '@playwright/test';
import { LeaderboardPage } from './pages/leaderboard-page';

test('loads and displays entries', async ({ page }) => {
    const leaderboard = new LeaderboardPage(page);
    await leaderboard.open();

    const title = await leaderboard.getTitleText();
    expect(title).toMatch(/^\d+ - .*/);

    const scores = await leaderboard.getScoresText();
    expect(scores[0]).toContain(':');
});

test('entries display proper time format', async ({ page }) => {
    const leaderboard = new LeaderboardPage(page);
    await leaderboard.open();

    const scores = await leaderboard.getScoresText();
    const count = await scores.length;
    for (let i = 0; i < count; i++) {
        const text = await scores[i];
        expect(text.match(/:^([0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/));
    }
});

test('scores are sorted by time ascending', async ({ page }) => {
    const leaderboard = new LeaderboardPage(page);
    await leaderboard.open();

    const scores = await leaderboard.getScoresText();
    const times = scores.map(s => parseInt(s.split(':')[0], 10));
    for (let i=0; i<times.length - 1; i++) {
        expect(times[i]).toBeLessThanOrEqual(times[i + 1]);
    }
});

test('can load specified mission id', async ({ page }) => {
    const leaderboard = new LeaderboardPage(page);
    await leaderboard.open(1);

    const firstTitle = await leaderboard.getTitleText();
    expect(firstTitle).toMatch(/^1 - .*/);

    let min = 2;
    let max = await leaderboard.getLastMissionId();
    let randMission = Math.floor(Math.random() * (max - min + 1)) + min;
    console.log(`random mission: ${randMission}`);

    await leaderboard.open(randMission);
    const secondTitle = await leaderboard.getTitleText();
    expect(secondTitle).toMatch(new RegExp(`^${randMission} - .*`));
});

test('previous button does not decrement when on first mission', async ({ page }) => {
    const leaderboard = new LeaderboardPage(page);
    await leaderboard.open();

    const firstTitle = await leaderboard.getTitleText();
    await leaderboard.clickPrevBtn();
    const afterTitle = await leaderboard.getTitleText();
    expect(afterTitle).toBe(firstTitle);
});

test('next button does not increase when on last mission', async ({ page }) => {
    const leaderboard = new LeaderboardPage(page);
    await leaderboard.open(await leaderboard.getLastMissionId());

    const firstTitle = await leaderboard.getTitleText();
    await leaderboard.clickNextBtn();
    const afterTitle = await leaderboard.getTitleText();
    expect(afterTitle).toBe(firstTitle);
});

// test('can cycle through all missions', async ({ page }) => {

// });

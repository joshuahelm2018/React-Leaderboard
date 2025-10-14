import { test, expect } from '@playwright/test';
import { LeaderboardPage } from './pages/leaderboard-page';

test('loads and displays entries', async ({ page }) => {
    const leaderboard = new LeaderboardPage(page);
    await leaderboard.open();

    await leaderboard.hasVisibleScores();
});

test('entries display proper time format', async ({ page }) => {
    const leaderboard = new LeaderboardPage(page);
    await leaderboard.open();

    await leaderboard.scoresDisplayProperTimeFormat();
});

test('scores are sorted by time ascending', async ({ page }) => {
    const leaderboard = new LeaderboardPage(page);
    await leaderboard.open();

    await leaderboard.isSortedAscending();
});

test('can load specified mission id', async ({ page }) => {
    const leaderboard = new LeaderboardPage(page);
    await leaderboard.open(1);
    leaderboard.titleHasMissionId(1);

    let min = 2;
    let max = await leaderboard.getLastMissionId();
    let randMission = Math.floor(Math.random() * (max - min + 1)) + min;
    console.log(`random mission: ${randMission}`);

    await leaderboard.open(randMission);
    await leaderboard.titleHasMissionId(randMission);

    await page.pause();
});

test('previous button does not decrement when on first mission', async ({ page }) => {
    const leaderboard = new LeaderboardPage(page);
    await leaderboard.open();

    await leaderboard.onFirstMission();
    await leaderboard.prevBtnDoesNotDecrement();
});

test('next button does not increase when on last mission', async ({ page }) => {
    const leaderboard = new LeaderboardPage(page);
    await leaderboard.open(await leaderboard.getLastMissionId());

    await leaderboard.onLastMission();
    await leaderboard.nextBtnDoesNotIncrement();
});

// test('can cycle through all missions', async ({ page }) => {

// });

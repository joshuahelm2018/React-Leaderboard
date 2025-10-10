import { test, expect } from '@playwright/test';

test('loads leaderboard and shows entries', async ({ page }) => {
    await page.goto('http://localhost');
  
    // Check that the title exists
    await expect(page.locator('h1')).toHaveText(new RegExp(`^(\\d+) - .*`));

      const scores = page.locator('ul li');
      await expect(scores.first()).toBeVisible();

      await expect(scores.first()).toContainText(':');
});

test('leaderboard scores are sorted by time ascending', async ({ page }) => {
    await page.goto('http://localhost');

    const scores = page.locator('ul li');
    await expect(scores.first()).toBeVisible();

    // await page.pause();

    const times = [];
    const count = await scores.count();
    for (let i = 0; i < count; i++) {
        const text = await scores.nth(i).textContent();
        const match = text.match(/: ^([0-9]|1[0-9]|2[0-3]):(?:[0-5])(?:[0-9])$/);
        if (match) {
            times.push(parseInt(match[1], 10));
        }
    }

    // await page.pause();

    for (let i = 0; i < times.length - 1; i++) {
        expect(times[i]).toBeLessThanOrEqual(times[i + 1]);
        await page.pause();
    }
});

test('previous button does not decrement when on first mission', async ({ page }) => {
    await page.goto('http://localhost');

    const missionHeader = page.locator('h1');
    await expect(missionHeader).toHaveText(/1 -/);

    const prevBtn = page.locator('button', { hasText: '⬅' });
    await prevBtn.click();

    await expect(missionHeader).toHaveText(/1 -/);
});

test('next button does not increase when on last mission', async ({ page }) => {
    await page.goto('http://localhost');

    const response = await page.request.get('http://localhost:4000/missions');
    const missions = await response.json();
    const lastMissionId = missions.length > 0 ? missions[missions.length - 1].id : 1;

    const nextBtn = page.locator('button', { hasText: '➡'});
    for (let i=0; i<missions.length-1; i++) {
        await nextBtn.click();
    }

    const missionHeader = page.locator('h1');
    await expect(missionHeader).toHaveText(new RegExp(`${lastMissionId} -`));

    await nextBtn.click();

    await expect(missionHeader).toHaveText(new RegExp(`${lastMissionId} -`));
});

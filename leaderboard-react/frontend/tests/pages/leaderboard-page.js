import { expect } from '@playwright/test';

export class LeaderboardPage {
    constructor(page) {
        this.page = page;
        this.title = page.locator('h1');
        this.scores = page.locator('ul li');
        this.prevBtn = page.locator('button', { hasText: '⬅' });
        this.nextBtn = page.locator('button', { hasText: '➡' });
    }

    async open(mission_id) {
        if (mission_id) {
            await this.page.goto(`http://localhost/?mission_id=${mission_id}`);
            await this.titleHasMissionId(mission_id);
        } else {
            await this.page.goto('http://localhost');
        }
    }

    async titleHasMissionId(id) {
        await expect(this.title).toHaveText(new RegExp(`^${id} - .*`));
    }

    async hasVisibleScores() {
        await expect(this.title).toHaveText(/^\d+ - .*/);
        await expect(this.scores.first()).toBeVisible();
        await expect(this.scores.first()).toContainText(':');
    }

    async scoresDisplayProperTimeFormat() {
        await expect(this.scores.first()).toBeVisible();

        const count = await this.scores.count();
        for (let i = 0; i < count; i++) {
            const text = await this.scores.nth(i).textContent();
            const match = text.match(/: ^([0-9]|1[0-9]|2[0-3]):(?:[0-5])(?:[0-9])$/);
            if (!match) {
                return false;
            }
        }

    }

    async isSortedAscending() {
        await expect(this.scores.first()).toBeVisible();

        const times = [];
        const count = await this.scores.count();
        for (let i = 0; i < count; i++) {
            const text = await this.scores.nth(i).textContent();
            const match = text.match(/: ^([0-9]|1[0-9]|2[0-3]):(?:[0-5])(?:[0-9])$/);
            if (match) {
                times.push(parseInt(match[1], 10));
            }
        }

        for (let i = 0; i < times.length - 1; i++) {
            expect(times[i]).toBeLessThanOrEqual(times[i + 1]);
            // await this.page.pause();
        }
    }

    async getLastMissionId() {
        const response = await fetch('http://localhost:4000/missions');
        const missions = await response.json();
        const lastMissionId = missions.length > 0 ? missions[missions.length - 1].id : 1;

        return lastMissionId;
    }

    async onFirstMission() {
        await expect(this.title).toHaveText(/^1 -/);
    }

    async onLastMission() {
        const lastMissionId = await this.getLastMissionId();
        await expect(this.title).toHaveText(new RegExp(`^${lastMissionId} -`));
    }

    async prevBtnDoesNotDecrement() {
        let curTitle = this.title.text;
        await this.prevBtn.click();
        await this.title.text === curTitle;
    }

    async prevBtnDecrements() {
        let curTitle = this.title.text;
        await this.prevBtn.click();
        await this.title.text !== curTitle;
    }

    async nextBtnDoesNotIncrement() {
        let curTitle = this.title.text;
        await this.nextBtn.click();
        await this.title.text === curTitle;
    }

    async nextBtnDecrements() {
        let curTitle = this.title.text;
        await this.nextBtn.click();
        await this.title.text !== curTitle;
    }
}
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
        } else {
            await this.page.goto('http://localhost');
        }
    }

    async getTitleText() {
        return this.title.textContent();
    }

    async getScoresText() {
        const count = await this.scores.count();
        const texts = [];
        for (let i = 0; i < count; i++) {
          texts.push(await this.scores.nth(i).textContent());
        }
        return texts;
    }

    async clickPrevBtn() { await this.prevBtn.click(); }
    async clickNextBtn() { await this.nextBtn.click(); }

    async getLastMissionId() {
        const response = await this.page.request.get('http://localhost:4000/missions');
        const missions = await response.json();
        const lastMissionId = missions.length > 0 ? missions[missions.length - 1].id : 1;

        return lastMissionId;
    }
}
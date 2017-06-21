import { Injectable } from '@angular/core';

import { Hero } from './hero';
import { HEROES } from './mock-heroes';

@Injectable()
export class HeroService {
    getHeroes(): Promise<Hero[]> {
        return Promise.resolve(HEROES);
    };

    getHeroesSlowly(): Promise<Hero[]> {
        return new Promise(resolve => {
            // server latency sim
            setTimeout(() => resolve(this.getHeroes()), 3000);
        });
    };
}
import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';

import { Observable }        from 'rxjs/Observable';
import { Subject }           from 'rxjs/Subject';

// Observable class extensions
import 'rxjs/add/observable/of';

// Observable operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

import { HeroSearchService } from './hero-search.service';
import { Hero }              from './hero';

@Component({
    selector: 'hero-search',
    templateUrl: '../templates/hero-search.component.html',
    styleUrls: [ '../styles/hero-search.component.scss' ],
    providers: [ HeroSearchService ]
})
export class HeroSearchComponent implements OnInit {
    heroes: Observable<Hero[]>;
    private searchTerms = new Subject<string>();

    constructor(
        private heroSearchService: HeroSearchService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.heroes = this.searchTerms
            .debounceTime(300)      // wait 300ms after each keystroke before considering the term
            .distinctUntilChanged() // ignore if next search term is same as previous
            .switchMap(term => term // switch to new Observable each time the term changes
                // return the http search Observable
                ? this.heroSearchService.search(term)
                // or the Observable of empty heroes if there was no search time
                : Observable.of<Hero[]>([]))
            .catch(error => {
                // todo :: add real error handling
                console.log(error);
                return Observable.of<Hero[]>([]);
            });
    }
    
    // push a search term in to the observable stream
    search(term: string): void {
        this.searchTerms.next(term);
    }

    gotoDetail(hero: Hero): void {
        let link = ['/heroes', hero.id];
        this.router.navigate(link);
    }
}
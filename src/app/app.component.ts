import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {PreviousRouteBusiness} from '../../e-commerce-ui-common/business/previous-route.service';
import { filter, map, mergeMap } from 'rxjs/internal/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css', '../../node_modules/font-awesome/css/font-awesome.css' ]
})
export class AppComponent implements OnInit {
  constructor(
    private router: Router,
    private previousRouteBusiness: PreviousRouteBusiness,
    private activatedRoute: ActivatedRoute,
    private titleService: Title
  ) {}

  ngOnInit() {
    // Permet de changer le titre de la page automatiquement en fonction du data title du rounting dans app.module.ts
    this.router.events.pipe(
      filter( event => event instanceof NavigationEnd)
    ).pipe(
      map(() => this.activatedRoute)
    ).pipe(
      map( route => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      })
    ).pipe(
      filter((route) => route.outlet === 'primary')
    )
      .pipe(
        mergeMap((route) => route.data)
      )
      .subscribe((event) => this.titleService.setTitle(event['title']));
  }
}

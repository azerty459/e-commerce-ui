import {Component, OnInit } from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {PreviousRouteBusiness} from '../../e-commerce-ui-common/business/previous-route.service';
import { filter, map, mergeMap } from 'rxjs/internal/operators';
import { Produit} from '../../e-commerce-ui-common/models/Produit';
import {ProduitBusiness} from '../../e-commerce-ui-common/business/produit.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css', '../../node_modules/font-awesome/css/font-awesome.css' ]
})
export class AppComponent implements OnInit {

  public produit = new Produit('', '', '', 0);

  constructor(
    private router: Router,
    private previousRouteBusiness: PreviousRouteBusiness,
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private produitBusiness: ProduitBusiness
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

  public submitSearch(): void {
    this.produitBusiness.searchedText = this.produit.nom;
    this.produitBusiness.search(this.produit.nom);
  }

}

import {Component, DoCheck, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {PreviousRouteBusiness} from '../../e-commerce-ui-common/business/previous-route.service';
import { filter, map, mergeMap } from 'rxjs/internal/operators';
import { Produit} from '../../e-commerce-ui-common/models/Produit';
import {ProduitBusiness} from '../../e-commerce-ui-common/business/produit.service';
import {ArbreService} from "../../e-commerce-ui-common/business/arbre.service";
import {CategorieFlatNode} from "../../e-commerce-ui-common/models/CategorieFlatNode";
import {CategorieNode} from "../../e-commerce-ui-common/models/CategorieNode";
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {NavItem} from "./components/menu-item/nav-item";
import {MatMenuTrigger} from "@angular/material";
import {FiltreService} from "../../e-commerce-ui-common/business/filtre.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css', '../../node_modules/font-awesome/css/font-awesome.css' ]
})
export class AppComponent implements OnInit{
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  navItems:NavItem[];
  nodeLoaded:boolean = false;
  public treeControl: FlatTreeControl<CategorieFlatNode>;
  public treeFlattener: MatTreeFlattener<CategorieNode, CategorieFlatNode>;
  public dataSource: MatTreeFlatDataSource<CategorieNode, CategorieFlatNode>;
  public produit = new Produit('', '', '', 0);
  public chosenCategorie = "";
  public categorieHasBeenSelected=false;
  constructor(
    private router: Router,
    private previousRouteBusiness: PreviousRouteBusiness,
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private produitBusiness: ProduitBusiness,
    private arbreService: ArbreService,
    private filterService: FiltreService,
  ) {
    this.treeFlattener = new MatTreeFlattener(arbreService.transformerNodeToFlatNode, arbreService.getLevel,
      arbreService.isExpandable, arbreService.getChildren);
    this.treeControl = new FlatTreeControl<CategorieFlatNode>(arbreService.getLevel, arbreService.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    arbreService.dataChange.subscribe(data => {
      this.dataSource.data = data;
    });
  }


  /**
   * Méthode permettant de charger les catégories du menu
   */
  public getNodes(){
    this.nodeLoaded=true;
    let primary :CategorieNode = new CategorieNode();
    primary.nomCategorie="Toutes nos catégories";
    primary.id=0;
    primary.children=JSON.parse(JSON.stringify(this.arbreService.data));
    this.navItems = JSON.parse(JSON.stringify([primary]));
  }

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

  /**
   * Méthode appelée par le formulaire de recherche
   */
  public submitSearch(): void {
    if (this.navItems !== undefined) {
      this.produitBusiness.searchedText = this.produit.nom;
      if (this.navItems[0].id !== undefined) {
        this.produitBusiness.search(this.produit.nom, this.navItems[0].id);
        this.produitBusiness.searchedCategorie = this.navItems[0].id;
        this.produitBusiness.searchedCategorieObject = this.navItems[0];
      }
    } else {
      this.produitBusiness.searchedCategorie = 0;
      this.produitBusiness.search(this.produit.nom, 0);
    }
    console.log(this.previousRouteBusiness.getCurrentUrl());
    if(this.previousRouteBusiness.getCurrentUrl().startsWith('/produit/detail')){
      this.router.navigate(['/produit']);
    }

  }




  /**
   * Methode appellée lors de la selection d'une catégorie dans le menu
   * @param categorie selectionnée
   */
  public selectCategorie(item: CategorieNode): void{
    if(this.nodeLoaded = true){
      this.trigger.closeMenu();
      this.chosenCategorie=item.nomCategorie;
      this.navItems[0].nomCategorie=item.nomCategorie;
      this.navItems[0].id=item.id;
      this.categorieHasBeenSelected=true;
    }
  }

  /**
   * Méthode apellé lors de la désélection de la catégorie sélectionné
   */
  public CancelCategorieChoice(){
    this.navItems = undefined;
    this.nodeLoaded = false;
    this.categorieHasBeenSelected=false;
    this.chosenCategorie ="";
  }

  public retourHome(){
    this.router.navigate(['/produit']);
  }
}

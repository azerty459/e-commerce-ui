import {Component, OnInit, Input, OnChanges} from '@angular/core';
import {Produit} from '../../../../e-commerce-ui-common/models/Produit';
import {Categorie} from '../../../../e-commerce-ui-common/models/Categorie';
import {BreadcrumbsService} from '../../../../e-commerce-ui-common/business/breadcrumbs.service';
import {CategoriedataService} from '../../../../e-commerce-ui-common/business/data/categoriedata.service';
import {forEach} from "@angular/router/src/utils/collection";
import {ProduiDataService} from "../../../../e-commerce-ui-common/business/data/produitData.service";
import {ProduitBusiness} from "../../../../e-commerce-ui-common/business/produit.service";
import {FiltreService} from "../../../../e-commerce-ui-common/business/filtre.service";
import {PaginationDataService} from "../../../../e-commerce-ui-common/business/data/pagination-data.service";
import {Router} from "@angular/router";
import {PreviousRouteBusiness} from "../../../../e-commerce-ui-common/business/previous-route.service";

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent implements OnInit, OnChanges {

  /**
   * La chaîne de caractères représentant le fil d'ariane des catégories d'un produit
   */
  public catBreadCrumb: string;
  /**
   * La catégorie du produit (sans les parents de cette catégorie)
   */
  public catProduit: string;
   /**
   * La catégorie actuelle du produit (la plus basse dans l'arborescence)
   */
   public allCategories = this.bcService.allCategories;
  @Input() categorie: Categorie;
  public categoriesForBreadCrumb = [];


  constructor(private previousRouteBusiness: PreviousRouteBusiness, private _router: Router,private paginationDataService:PaginationDataService,private filtreService: FiltreService, private produitBusiness: ProduitBusiness,private produitDataService: ProduiDataService, private bcService: BreadcrumbsService, private categorieData: CategoriedataService) { }

  ngOnInit() {
  }
  ngOnChanges() {
    console.log(this.previousRouteBusiness.getCurrentUrl().startsWith('/produit/detail'));
    this.categoriesForBreadCrumb = [];
    this.buildBreadCrumb();
  }

  /**
   * Construit le fil d'ariane
   */
  public async buildBreadCrumb() {
    if(this.allCategories === undefined){
      this.bcService.allCategories = await this.categorieData.getChemin();
      this.allCategories = this.bcService.allCategories;
    }
    console.log(this.allCategories);
    for (let categorie of this.allCategories){
      if(categorie.id === this.categorie.id){
        this.categorie.chemin = categorie.chemin + ' > ' + this.categorie.id;
      }
    }
    const listIdString = this.categorie.chemin.split(' > ');
    for (let id of listIdString){
      for(let categorie of this.allCategories){
        if (categorie.id.toString() === id){
          const categorieToAdd = new Categorie(categorie.id,categorie.nom,categorie.level,categorie.chemin+' > '+categorie.id);
          this.categoriesForBreadCrumb.push(categorieToAdd);
        }
      }
    }
    console.log(this.categoriesForBreadCrumb);
  }
  public async redirect(categorieChoisie,i){
    if(!this.isClickable(i)){

    }else{
      const result = await this.produitBusiness.getProduitByPaginationSearch(1,this.filtreService.getNbProduitParPage(),'',categorieChoisie.id)
      this.produitDataService.produits.arrayProduit = result.tableau;
      this.produitDataService.produits.length = result.total;
      this.paginationDataService.paginationProduit.pageActuelle = result.pageActuelle;
      this.paginationDataService.paginationProduit.pageMax = result.pageMax;
      this.paginationDataService.paginationProduit.total = result.total;
      this.paginationDataService.paginationProduit.tableau = result.tableau;
      this.paginationDataService.paginationProduit.pageMin = result.pageMin;
      this.previousRouteBusiness.retour = true;
      this.filtreService.categorieForBreadCrum = categorieChoisie;
      this._router.navigate(['/produit']);
    }

  }

  public isClickable(i): boolean {
    return this.categoriesForBreadCrumb.length !== i+1 || this.previousRouteBusiness.getCurrentUrl().startsWith('/produit/detail')
  }


}

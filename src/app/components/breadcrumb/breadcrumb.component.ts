import {Component, OnInit, Input, OnChanges} from '@angular/core';
import {Produit} from '../../../../e-commerce-ui-common/models/Produit';
import {Categorie} from '../../../../e-commerce-ui-common/models/Categorie';
import {BreadcrumbsService} from '../../../../e-commerce-ui-common/business/breadcrumbs.service';
import {CategoriedataService} from '../../../../e-commerce-ui-common/business/data/categoriedata.service';

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
  @Input() categorie: Categorie;


  constructor(private bcService: BreadcrumbsService, private categorieData: CategoriedataService) { }

  ngOnInit() {

    this.buildBreadCrumb();

  }
  ngOnChanges() {
    this.buildBreadCrumb();
  }

  /**
   * Construit le fil d'ariane
   */
  public buildBreadCrumb(): void {
    // Récupérer le fil d'ariane
    let promiseCategorie = null;
    if(this.categorie !== undefined) {
      promiseCategorie = this.categorieData.getChemin(this.categorie);
    }

    if(promiseCategorie !== null) {
      promiseCategorie.then((c) => {
        this.catBreadCrumb = c.chemin + ' > ';

        // Rajout de la catégorie du produit
        this.catProduit = this.categorie.nomCat;
      });
    }
  }

}

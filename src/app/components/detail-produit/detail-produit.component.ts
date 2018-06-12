import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Produit} from '../../../../e-commerce-ui-common/models/Produit';
import {ProduitBusiness} from '../../../../e-commerce-ui-common/business/produit.service';
import { BreadcrumbsService} from '../../../../e-commerce-ui-common/business/breadcrumbs.service';
import {Categorie} from '../../../../e-commerce-ui-common/models/Categorie';
import {CategoriedataService} from '../../../../e-commerce-ui-common/business/data/categoriedata.service';


@Component({
  selector: 'app-detail-produit',
  templateUrl: './detail-produit.component.html',
  styleUrls: ['./detail-produit.component.css']
})
export class DetailProduitComponent implements OnInit {

  public promiseProduit: Promise<Produit>;
  public produit: Produit;
  public pageActuelURL: string;
  positionAfterTooltip = 'after';

  // Chaîne de catactères représentant le fil d'ariane pour les catégories (jusque la catégorie juste avant celle du produit)
  public catBreadCrumb: string;

  constructor(private produitBusiness: ProduitBusiness, private activatedRoute: ActivatedRoute, private _router: Router, private breadcrumb: BreadcrumbsService, private categorieData: CategoriedataService) {
    this.activatedRoute.params.subscribe(params => {
        this.pageActuelURL = params.ref;
      },
      error => {
        console.log('Erreur gestion de page ', error)
      },
    );
  }

  public categoriePourFil: Categorie;

  ngOnInit() {
    this.affichage();
  }



  async affichage() {
    this.promiseProduit = this.produitBusiness.getProduitByRef(this.pageActuelURL);
    this.promiseProduit.then(
      (value) => {

        this.produit = value;

        // Récupérer la catégorie qui servira à construire le fil de catégories du produit
        this.categoriePourFil = this.breadcrumb.getBreadCrumb(this.produit);

        // Récupérer le fil d'ariane de la catégorie si on a récupéré une catégorie
        if(this.categoriePourFil !== undefined) {
          const promiseCategorie = this.categorieData.getChemin(this.categoriePourFil);
          promiseCategorie.then((c) => {
            this.catBreadCrumb = c.chemin + ' > ';
          });
        }
      }
    );
  }
}



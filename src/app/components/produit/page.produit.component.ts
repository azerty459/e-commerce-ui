import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Produit} from '../../../../e-commerce-ui-common/models/Produit';
import {ProduitBusiness} from '../../../../e-commerce-ui-common/business/produit.service';
import {Pagination} from '../../../../e-commerce-ui-common/models/Pagination';
import {PreviousRouteBusiness} from '../../../../e-commerce-ui-common/business/previous-route.service';
import {CategorieBusinessService} from "../../../../e-commerce-ui-common/business/categorie.service";
import {Categorie} from "../../../../e-commerce-ui-common/models/Categorie";

@Component({
  selector: 'app-produit',
  templateUrl: './page.produit.component.html',
  styleUrls: ['./page.produit.component.css']
})
export class ProduitComponent implements OnInit {

  public page: Promise<Pagination>;

  /**
   * Tableau de produits à afficher
   */
  public produits: Array<Produit>;

  /**
   * Taille du tableau de produits à afficher
   */
  public lengthProduit;

  /**
   * Numéro de la page actuelle
   */
  public pageActuelURL: number;


  public pageMax: number;
  public pageMin: number;
  public categorieForBreadCrum;
  /**
   * Indique si une recherche de produits a été effectuée
   */
  public searchIsOn: boolean;

  /**
   * Le texte recherché
   */
  public searchedText: string;

  /**
   * true s'il y a des produits suivants à afficher et donc une page suivante
   */
  public hasNextPage: boolean;

  /**
   * true s'il y a une page précédente
   */
  public hasPreviousPage: boolean;

  /**
   * Nombre de produits par page
   * @type {number}
   */
  public messagesParPage = 5;
  public back = false;
  constructor(private categorieBusiness: CategorieBusinessService,private produitBusiness: ProduitBusiness, private activatedRoute: ActivatedRoute,
              private _router: Router, private previousRouteBusiness: PreviousRouteBusiness) {
    this.activatedRoute.params.subscribe(params => {
        this.pageActuelURL = parseInt(params.page, 10);
        const backValue = params['back'];
        if (backValue === '1') {
          console.log('back');
          this.back = true;
        } else {

          console.log('pas back');
        }
      },
      error => {
        console.log('Erreur gestion de page', error);
      },
    );
  }

  ngOnInit() {

    // Déclenche l'affichage au chargement de la page
    this.affichage();

    // On a rechargé la page donc on n'est pas dans le cadre d'une recherche de produits.
    this.searchIsOn = false;

    // On souscrit à un Observable. Permet de recevoir une nouvelle liste paginée de produits à afficher
    // en cas de recherche de produits par l'utilisateur.
    this.produitBusiness.subject.subscribe((result) => {
      this.produits = result.tableau;
      this.lengthProduit = result.total;
      this.pageActuelURL = result.pageActuelle;
      this.pageMax = result.pageMax;
      // On est dans le cadre d'une recherche (sauf si la chaîne recherchée est de longueur 0)
      if(this.produitBusiness.searchedText.length === 0) {
        this.searchIsOn = false;
      } else {
        this.searchIsOn = true;
      }
      this.getSearchedCategorie();
    });
  }


  async affichage() {

    // Remise à zéro de la recherche si le texte recherché est de longueur 0
    if(this.searchIsOn && this.produitBusiness.searchedText.length === 0) {
      this.searchIsOn = false;
    }

    if(!this.searchIsOn) {
      console.log('nb message par page sans recherche');

      console.log(this.messagesParPage);
      this.page = this.produitBusiness.getProduitByPagination(this.pageActuelURL, this.messagesParPage);
    } else {
      this.page = this.produitBusiness.getProduitByPaginationSearch(this.pageActuelURL, this.messagesParPage, this.produitBusiness.searchedText, this.produitBusiness.searchedCategorie);
    }

    this.page.then(value => {
        this.pageActuelURL = value.pageActuelle;
        this.lengthProduit = value.total;
        this.produits = value.tableau;

      },
      error2 => {
        console.log('Erreur getProduitByPagination', error2);
      });
    this.pageMax = await this.getPageMax();
    this.pageMin = await this.getPageMin();
    if(this.searchIsOn) {
      this.produitBusiness.subject.next(new Pagination(this.pageActuelURL, this.pageMin, this.pageMax, this.lengthProduit, this.produits));
    }

    // Désactivation du bouton suivant s'il n'y a pas de page suivante
    if(this.pageActuelURL === this.pageMax) {
      this.hasNextPage = false;
    }
    else {
      this.hasNextPage = true;
    }

    // Désactivation du bouton précédent s'il n'y a pas de page précédente
    if(this.pageActuelURL === 1) {
      this.hasPreviousPage = false;
    }
    else {
      this.hasPreviousPage = true;
    }

    this.redirection();
  }


  // Permet
  getPageMin(): Promise<number> {
    return new Promise(resolve => this.page.then(value => resolve(value.pageMin)));
  }

  getPageMax(): Promise<number> {
    return new Promise(resolve => this.page.then(value => resolve(value.pageMax)));
  }

  async redirection() {
    if (this.pageActuelURL <= 0) {
      console.log('redirection');
      this._router.navigate(['/produit', this.pageMin]);
    } else if (this.pageActuelURL > this.pageMax) {
      console.log('redirection');
      this._router.navigate(['/produit', this.pageMax]);
    }
  }

  selected(value: any) {
    this.messagesParPage = value;
    this.affichage();

  }

  pagination(value: String) {
    if (value === 'precedent') {
      if (this.pageActuelURL > this.pageMin) {
        this.pageActuelURL = this.pageActuelURL - 1;
      }
    } else {
      if (this.pageActuelURL < this.pageMax) {
        this.pageActuelURL = this.pageActuelURL + 1;
      }
    }
    this.affichage();

    this._router.navigate(['/produit', this.pageActuelURL]);
  }

  redirectionPageDetail (ref: string){
    this.previousRouteBusiness.setCurrentUrl(this._router.url);
    this._router.navigate(['/produit/detail', ref]);
  }

  public  getSearchedCategorie() {
    const categorieNode = this.produitBusiness.searchedCategorieObject;
    if(categorieNode.id !== 0){ //0 équivaut aucune catégorie existante
      this.categorieForBreadCrum = new Categorie(categorieNode.id,categorieNode.nomCategorie,undefined,undefined);
    } else {
      this.categorieForBreadCrum = undefined;
    }

  }
}

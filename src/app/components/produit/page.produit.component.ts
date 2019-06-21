import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ProduitBusiness} from '../../../../e-commerce-ui-common/business/produit.service';
import {Pagination} from '../../../../e-commerce-ui-common/models/Pagination';
import {PreviousRouteBusiness} from '../../../../e-commerce-ui-common/business/previous-route.service';
import {CategorieBusinessService} from '../../../../e-commerce-ui-common/business/categorie.service';
import {ProduiDataService} from '../../../../e-commerce-ui-common/business/data/produit-data.service';
import {FiltreService} from '../../../../e-commerce-ui-common/business/filtre.service';
import {PaginationDataService} from '../../../../e-commerce-ui-common/business/data/pagination-data.service';
import {environment} from '../../../../src/environments/environment';

@Component({
  selector: 'app-produit',
  templateUrl: './page.produit.component.html',
  styleUrls: ['./page.produit.component.css']
})
export class ProduitComponent implements OnInit {
//  @ViewChild('messageParPageSelect') messageParPageSelect: ElementRef;
  public page: Pagination = this.paginationDataService.paginationProduit;

  public nbProduitsParPage = this.filtreService.getNbProduitParPage();

  public nameOfTri = this.filtreService.getNameOfTri();
  /**
   * Tableau de produits à afficher
   */
  public;
  produits = this.produitDataService.produits;
  public api_download_url = environment.api_rest_download_url;


  public categorieForBreadCrum = this.filtreService.categorieForBreadCrum;


  /**
   * Le texte recherché
   */
  public searchedText: string;

  public pageInitiale: number;

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
  constructor(public paginationDataService: PaginationDataService, public filtreService: FiltreService, public produitDataService: ProduiDataService, public categorieBusiness: CategorieBusinessService, public produitBusiness: ProduitBusiness, public activatedRoute: ActivatedRoute,
              public _router: Router, public previousRouteBusiness: PreviousRouteBusiness) {
    this.activatedRoute.params.subscribe(params => {
      this.pageInitiale = parseInt(params.page, 10);
      this.page.pageActuelle = parseInt(params.page, 10);
    });
  }

  ngOnInit() {
    if (this.pageInitiale <= 0) {
      this.pageInitiale = 1;
      this.page.pageActuelle = 1;
    }
    if (!this.previousRouteBusiness.retour) {
      this.initialisation();
    }
  }


  async initialisation() {
    this.getPaginationWithoutSearch(this.pageInitiale, this.nbProduitsParPage, this.nameOfTri);
    this._router.navigate(['/produit', this.page.pageActuelle]);
  }

  async redirection() {
    if (this.page.pageActuelle <= 0) {
      this._router.navigate(['/produit', this.page.pageMin]);
    } else if (this.page.pageActuelle > this.page.pageMax) {
      this._router.navigate(['/produit', this.page.pageMax]);
    }
  }

  async selectedNameOfTri(name: string) {
    this.filtreService.saveNameOfTri(name);
    this.reloadProduct();

    this.redirection();
  }

  async selected(value: number) {
    this.filtreService.saveNbProduitParPage(value);
    this.reloadProduct();

    // Désactivation du bouton suivant s'il n'y a pas de page suivante
    if (this.page.pageActuelle === this.page.pageMax) {
      this.hasNextPage = false;
    } else {
      this.hasNextPage = true;
    }

    // Désactivation du bouton précédent s'il n'y a pas de page précédente
    if (this.page.pageActuelle === 1) {
      this.hasPreviousPage = false;
    } else {
      this.hasPreviousPage = true;
    }

    this.redirection();

  }

  async pagination(value: String) {
    if (value === 'precedent') {
      if (this.page.pageActuelle > this.page.pageMin) {
        this.page.pageActuelle = this.page.pageActuelle - 1;
      }
    } else {
      if (this.page.pageActuelle < this.page.pageMax) {
        this.page.pageActuelle = this.page.pageActuelle + 1;

      }
    }
    this.filtreService.pageAffiche = this.page.pageActuelle;
    this.reloadProduct();
    this._router.navigate(['/produit', this.page.pageActuelle]);
  }

  redirectionPageDetail(ref: string) {
    this.previousRouteBusiness.setCurrentUrl(this._router.url);
    this._router.navigate(['/produit/detail', ref]);
  }

  private async getPaginationWithoutSearch(pageDemande: number, messageParPage: number, nameOfTri: String) {
    const result = await this.produitBusiness.getProduitByPagination(pageDemande, messageParPage, nameOfTri);
    this.produits.arrayProduit = result.tableau;
    this.produits.length = result.total;
    if (result.pageActuelle === 0) {
      this.page.pageActuelle = 1;
    } else {
      this.page.pageActuelle = result.pageActuelle;
    }
    this.page.pageMax = result.pageMax;
    this.page.total = result.total;
    this.page.tableau = result.tableau;
    this.page.pageMin = result.pageMin;
    this.produitDataService.produits.arrayProduit = this.page.tableau;
  }

  private async getPaginationWithSearch(pageDemande: number, messageParPage: number) {
    const result = await this.produitBusiness.getProduitByPaginationSearch(pageDemande, messageParPage, this.produitBusiness.searchedText, this.produitBusiness.searchedCategorie);
    this.produitDataService.produits.arrayProduit = result.tableau;
    this.produitDataService.produits.length = result.total;
    this.paginationDataService.paginationProduit.pageActuelle = result.pageActuelle;
    this.paginationDataService.paginationProduit.pageMax = result.pageMax;
    this.paginationDataService.paginationProduit.total = result.total;
    this.paginationDataService.paginationProduit.tableau = result.tableau;
    this.paginationDataService.paginationProduit.pageMin = result.pageMin;
  }

  private reloadProduct(): void {
    const pasDeTexteRecherche = this.produitBusiness.searchedText == '' || this.produitBusiness.searchedText == undefined || this.produitBusiness.searchedText == null;
    const pasDeCategorieRecherche = this.filtreService.categorieForBreadCrum == undefined && this.filtreService.categorieForBreadCrum == null;
    if (pasDeCategorieRecherche && pasDeTexteRecherche) {
      this.getPaginationWithoutSearch(this.page.pageActuelle, this.nbProduitsParPage, this.nameOfTri);
    } else {
      this.getPaginationWithSearch(this.page.pageActuelle, this.nbProduitsParPage);
    }
  }


}

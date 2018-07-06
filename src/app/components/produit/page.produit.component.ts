import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ProduitBusiness} from '../../../../e-commerce-ui-common/business/produit.service';
import {Pagination} from '../../../../e-commerce-ui-common/models/Pagination';
import {PreviousRouteBusiness} from '../../../../e-commerce-ui-common/business/previous-route.service';
import {CategorieBusinessService} from "../../../../e-commerce-ui-common/business/categorie.service";
import {ProduiDataService} from "../../../../e-commerce-ui-common/business/data/produitData.service";
import {FiltreService} from "../../../../e-commerce-ui-common/business/filtre.service";
import {PaginationDataService} from "../../../../e-commerce-ui-common/business/data/pagination-data.service";

@Component({
  selector: 'app-produit',
  templateUrl: './page.produit.component.html',
  styleUrls: ['./page.produit.component.css']
})
export class ProduitComponent implements OnInit {
  @ViewChild('messageParPageSelect') messageParPageSelect: ElementRef;
  public page:Pagination = this.paginationDataService.paginationProduit;

  /**
   * Tableau de produits à afficher
   */
  public produits = this.produitDataService.produits;



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
  public messagesParPage = this.filtreService.getNbProduitParPage();
  constructor(public paginationDataService: PaginationDataService,public filtreService: FiltreService,public produitDataService: ProduiDataService,public categorieBusiness: CategorieBusinessService,public produitBusiness: ProduitBusiness, public activatedRoute: ActivatedRoute,
              public _router: Router, public previousRouteBusiness: PreviousRouteBusiness) {
    this.activatedRoute.params.subscribe(params => {
      this.pageInitiale = parseInt(params.page, 10);
    })
  }
  ngOnInit() {
    this.messageParPageSelect.nativeElement.value = this.messagesParPage;
    if(this.pageInitiale <=0 ){
      this.pageInitiale = 1;
    }
    if(!this.previousRouteBusiness.retour){
      this.initialisation();
    }
  }


  async initialisation() {
    this.getPaginationWithoutSearch(this.pageInitiale,this.messagesParPage);
    this._router.navigate(['/produit', this.page.pageActuelle]);
  }

  private async getPaginationWithoutSearch(pageDemande:number,messageParPage:number){
    const result =  await this.produitBusiness.getProduitByPagination(pageDemande, messageParPage);
    this.produits.arrayProduit = result.tableau;
    this.produits.length = result.total;
    this.page.pageActuelle = result.pageActuelle;
    this.page.pageMax = result.pageMax;
    this.page.total = result.total;
    this.page.tableau = result.tableau;
    this.page.pageMin = result.pageMin;
    this.produitDataService.produits.arrayProduit = this.page.tableau;
  }
  private async getPaginationWithSearch(pageDemande:number,messageParPage:number){

    const result = await this.produitBusiness.getProduitByPaginationSearch(pageDemande, messageParPage, this.produitBusiness.searchedText, this.produitBusiness.searchedCategorie);
    this.produitDataService.produits.arrayProduit = result.tableau;
    this.produitDataService.produits.length = result.total;
    this.paginationDataService.paginationProduit.pageActuelle = result.pageActuelle;
    this.paginationDataService.paginationProduit.pageMax = result.pageMax;
    this.paginationDataService.paginationProduit.total = result.total;
    this.paginationDataService.paginationProduit.tableau = result.tableau;
    this.paginationDataService.paginationProduit.pageMin = result.pageMin;
  }





  async redirection() {
    if (this.page.pageActuelle <= 0) {
      console.log('redirection');
      this._router.navigate(['/produit', this.page.pageMin]);
    } else if (this.page.pageActuelle > this.page.pageMax) {
      console.log('redirection');
      this._router.navigate(['/produit', this.page.pageMax]);
    }
  }

  async selected(value: number) {
    this.filtreService.saveNbProduitParPage(value);
    this.messagesParPage = value;
    const pasDeTexteRecherche = this.produitBusiness.searchedText =='' || this.produitBusiness.searchedText == undefined ||this.produitBusiness.searchedText==null;
    const pasDeCategorieRecherche = this.filtreService.categorieForBreadCrum == undefined && this.filtreService.categorieForBreadCrum == null;
    if (pasDeCategorieRecherche && pasDeTexteRecherche ){
      console.log("without");
      this.getPaginationWithoutSearch(this.page.pageActuelle,this.messagesParPage);
    } else {
      console.log("with");
      this.getPaginationWithSearch(this.page.pageActuelle,this.messagesParPage);
    }

    // Désactivation du bouton suivant s'il n'y a pas de page suivante
    if(this.page.pageActuelle === this.page.pageMax) {
      this.hasNextPage = false;
    }
    else {
      this.hasNextPage = true;
    }

    // Désactivation du bouton précédent s'il n'y a pas de page précédente
    if(this.page.pageActuelle === 1) {
      this.hasPreviousPage = false;
    }
    else {
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
    const pasDeTexteRecherche = this.produitBusiness.searchedText =='' || this.produitBusiness.searchedText == undefined ||this.produitBusiness.searchedText==null;
    const pasDeCategorieRecherche = this.filtreService.categorieForBreadCrum == undefined && this.filtreService.categorieForBreadCrum == null;
    if (pasDeCategorieRecherche && pasDeTexteRecherche ){
      console.log("without");
      this.getPaginationWithoutSearch(this.page.pageActuelle,this.messagesParPage);
    } else {
      console.log("with");
      this.getPaginationWithSearch(this.page.pageActuelle,this.messagesParPage);
    }
    this._router.navigate(['/produit', this.page.pageActuelle]);
  }

  redirectionPageDetail (ref: string){
    this.previousRouteBusiness.setCurrentUrl(this._router.url);
    this._router.navigate(['/produit/detail', ref]);
  }


}

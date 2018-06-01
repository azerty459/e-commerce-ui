import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Produit} from '../../../../e-commerce-ui-common/models/Produit';
import {ProduitBusiness} from '../../../../e-commerce-ui-common/business/produit.service';
import {Pagination} from '../../../../e-commerce-ui-common/models/Pagination';
import {PreviousRouteBusiness} from '../../../../e-commerce-ui-common/business/previous-route.service';

@Component({
  selector: 'app-produit',
  templateUrl: './page.produit.component.html',
  styleUrls: ['./page.produit.component.css']
})
export class ProduitComponent implements OnInit {

  public page: Promise<Pagination>;
  public produits: Array<Produit>;
  public lengthProduit;

  public pageActuelURL: number;
  public pageMax: number;
  public pageMin: number;
  public messagesParPage = 5;
  public back = false;

  constructor(private produitBusiness: ProduitBusiness, private activatedRoute: ActivatedRoute,
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
    this.affichage();
  }

  async affichage() {
    this.page = this.produitBusiness.getProduitByPagination(this.pageActuelURL, this.messagesParPage);
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
}

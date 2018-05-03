import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {ActivatedRoute, Router} from "@angular/router";
import {Produit} from "../../../../e-commerce-ui-common/models/Produit";
import {ProduitBusiness} from "../../../../e-commerce-ui-common/business/produit.business";
import {Pagination} from "../../../../e-commerce-ui-common/models/Pagination";

@Component({
  selector: 'app-produit',
  templateUrl: './page.produit.component.html',
  styleUrls: ['./page.produit.component.css']
})
export class ProduitComponent implements OnInit {

  public page: Observable<Pagination>;
  public produits: Array<Produit>;
  public lengthProduit;

  public pageURL: number;
  public pageMax: number;
  public pageMin: number;
  public messagesParPage: number = 5;

  constructor(private produitBusiness: ProduitBusiness, private activatedRoute: ActivatedRoute, private _router: Router) {
    this.activatedRoute.params.subscribe(params => {
        this.pageURL = parseInt(params.page);
      },
      error => {
        console.log("Erreur gestion de page ", error)
      },
    );
  }

  async affichage() {
    this.page = this.produitBusiness.getProduitByPagination(this.pageURL, this.messagesParPage);
    this.page.subscribe(value => {
        this.pageURL = value.pageActuelle;
        this.lengthProduit = value.total;
        this.produits = value.tableau;
      },
      error2 => {
        console.log("Erreur getProduitByPagination", error2)
      });
    this.pageMax = await this.getPageMax();
    this.pageMin = await this.getPageMin();
    this.redirection();
    this._router.navigate(['/produit', this.pageURL]);
  }

  // Permet
  getPageMin(): Promise<number> {
    return new Promise(resolve => this.page.subscribe(value => resolve(value.pageMin)));
  }

  getPageMax(): Promise<number> {
    return new Promise(resolve => this.page.subscribe(value => resolve(value.pageMax)));
  }

  async redirection() {
    if (this.pageURL <= 0)
      this._router.navigate(['/produit', await this.pageMin]);
    else if (this.pageURL > this.pageMax) {
      this._router.navigate(['/produit', await this.pageMax]);
    }
  }

  ngOnInit() {
    this.affichage();
  }

  selected(value: any) {
    this.messagesParPage = value;
    this.affichage();
  }

  pagination(value: String) {
    if (value === "precedent") {
      if (this.pageURL > this.pageMin) {
        this.pageURL = this.pageURL - 1;
      }
    } else {
      if (this.pageURL < this.pageMax) {
        this.pageURL = this.pageURL + 1;
      }
    }
    this.affichage();
  }
}

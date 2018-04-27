import { Component, OnInit } from '@angular/core';
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

  public nombrePages:number;
  public pageInitial:number = 1;
  public messagesParPage: number = 5;

  constructor(private produitBusiness: ProduitBusiness, private activatedRoute: ActivatedRoute, private _router: Router){
  }

  init() {
    this.page = this.produitBusiness.getProduitByPagination(this.pageInitial, this.messagesParPage);
    this.page.subscribe(value => {this.lengthProduit = value.total; this.nombrePages = value.nbpage; this.produits = value.tableau;});
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => this.pageInitial = parseInt(params.page));
    this.init();
  }

  selected(value: any) {
    this.messagesParPage = value;
    this.init();
  }

  pagination(value: String) {
    if(value === "precedent"){
      if(this.pageInitial > 1){
        this.pageInitial = this.pageInitial-1;
      }
    }else {
      if(this.pageInitial < this.nombrePages) {
        this.pageInitial = this.pageInitial + 1;
      }
    }
    this.init();
    this._router.navigate(['/produit', this.pageInitial]);
  }
}

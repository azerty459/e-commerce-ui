import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs/Observable";
import {ActivatedRoute, Router} from "@angular/router";
import {Produit} from "../../../../e-commerce-ui-common/models/Produit";
import {ProduitBusiness} from "../../../../e-commerce-ui-common/business/produit.business";

@Component({
  selector: 'app-produit',
  templateUrl: './page.produit.component.html',
  styleUrls: ['./page.produit.component.css']
})
export class ProduitComponent implements OnInit {

  public produits: Observable<Produit[]>;
  public lengthProduit;

  public nombrePages:number;
  public pageInitial:number;
  public messagesParPage: number = 5;

  constructor(private produitBusiness: ProduitBusiness, private activatedRoute: ActivatedRoute, private _router: Router){
  }

  init() {
    this.produits = this.produitBusiness.getProduitByPagination((this.pageInitial-1)*this.messagesParPage,this.pageInitial*this.messagesParPage);
    this.produitBusiness.getProduit().subscribe(async(value) => {this.lengthProduit = value.length; this.nombrePages = Math.ceil(this.lengthProduit/this.messagesParPage);});
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
    this.produits = this.produitBusiness.getProduitByPagination((this.pageInitial-1)*this.messagesParPage,this.pageInitial*this.messagesParPage);
    this._router.navigate(['/produit', this.pageInitial]);
  }
}

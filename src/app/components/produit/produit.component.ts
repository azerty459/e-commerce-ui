import { Component, OnInit } from '@angular/core';
import {ProduitBusiness} from "../../business/ProduitBusiness";
import {Produit} from "../../models/Produit";
import {Observable} from "rxjs/Observable";

@Component({
  selector: 'app-produit',
  templateUrl: './produit.component.html',
  styleUrls: ['./produit.component.css']
})
export class ProduitComponent implements OnInit {

  public produits: Observable<Produit[]>;

  constructor(private produitBusiness: ProduitBusiness){

  }

  ngOnInit() {
    this.produits = this.produitBusiness.getProduit();
  }
}

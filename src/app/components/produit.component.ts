import { Component, OnInit } from '@angular/core';
import {ProduitBusiness} from "../business/ProduitBusiness";
import {Produit} from "../models/Produit";
import {Observable} from "rxjs/Observable";

@Component({
  selector: 'app-produit',
  templateUrl: '../resources/html/produit.html',
  styleUrls: ['../resources/css/produit.css']
})
export class ProduitComponent implements OnInit {

  public produits: Observable<Produit[]>;

  constructor(private produitBusiness: ProduitBusiness){

  }

  ngOnInit() {
    this.produits = this.produitBusiness.getProduit();

  }
}

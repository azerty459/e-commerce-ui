import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs/Observable";
import {ActivatedRoute, Router} from "@angular/router";
import {Produit} from "../../../../e-commerce-ui-common/models/Produit";
import {ProduitBusiness} from "../../../../e-commerce-ui-common/business/produit.business";
import {Categorie} from "../../../../e-commerce-ui-common/models/Categorie";


@Component({
  selector: 'app-detail-produit',
  templateUrl: './detail-produit.component.html',
  styleUrls: ['./detail-produit.component.css']
})
export class DetailProduitComponent implements OnInit {
  public observableProduit: Observable<Produit>;
  public produit: Produit;
  public pageActuelURL: string;


  constructor(private produitBusiness: ProduitBusiness, private activatedRoute: ActivatedRoute, private _router: Router) {
    this.activatedRoute.params.subscribe(params => {
        this.pageActuelURL = params.ref;
      },
      error => {
        console.log("Erreur gestion de page ", error)
      },
    );
  }

  ngOnInit() {
    this.affichage();
  }

  async affichage() {
    this.observableProduit = this.produitBusiness.getProduitByRef(this.pageActuelURL);
    this.observableProduit.subscribe(
      value => this.produit = value
    )
  }

}



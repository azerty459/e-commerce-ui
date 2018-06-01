import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Produit} from '../../../../e-commerce-ui-common/models/Produit';
import {ProduitBusiness} from '../../../../e-commerce-ui-common/business/produit.service';


@Component({
  selector: 'app-detail-produit',
  templateUrl: './detail-produit.component.html',
  styleUrls: ['./detail-produit.component.css']
})
export class DetailProduitComponent implements OnInit {
  public promiseProduit: Promise<Produit>;
  public produit: Produit;
  public pageActuelURL: string;
  positionAfterTooltip = 'after';
  constructor(private produitBusiness: ProduitBusiness, private activatedRoute: ActivatedRoute, private _router: Router) {
    this.activatedRoute.params.subscribe(params => {
        this.pageActuelURL = params.ref;
      },
      error => {
        console.log('Erreur gestion de page ', error)
      },
    );
  }

  ngOnInit() {
    this.affichage();
  }

  async affichage() {
    this.promiseProduit = this.produitBusiness.getProduitByRef(this.pageActuelURL);
    this.promiseProduit.then(
      value => this.produit = value
    );
  }

}



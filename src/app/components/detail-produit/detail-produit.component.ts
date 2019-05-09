import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Produit} from '../../../../e-commerce-ui-common/models/Produit';
import {ProduitBusiness} from '../../../../e-commerce-ui-common/business/produit.service';
import { BreadcrumbsService} from '../../../../e-commerce-ui-common/business/breadcrumbs.service';
import {Categorie} from '../../../../e-commerce-ui-common/models/Categorie';
import {CategoriedataService} from '../../../../e-commerce-ui-common/business/data/categoriedata.service';
import {AvisService} from "../../../../e-commerce-ui-common/business/avis.service";
import {Avis} from "../../../../e-commerce-ui-common/models/Avis";
import {MatSnackBar} from "@angular/material";


@Component({
  selector: 'app-detail-produit',
  templateUrl: './detail-produit.component.html',
  styleUrls: ['./detail-produit.component.css']
})
export class DetailProduitComponent implements OnInit {
  @Input('rating') rating= 0;
  @Input('starCount') starCount = 5;
  @Input('color') starColor: string;

  public promiseProduit: Promise<Produit>;
  public promiseAvis: Promise<[Avis]>;
  public produit: Produit;
  public pageActuelURL: string;
  public arrayPhotoUrl;
  positionAfterTooltip = 'after';
  @ViewChild('image') public image;
  // Chaîne de catactères représentant le fil d'ariane pour les catégories (jusque la catégorie juste avant celle du produit)
  public catBreadCrumb: string;

  constructor(private snackBar: MatSnackBar,private avisService: AvisService, private produitBusiness: ProduitBusiness, private activatedRoute: ActivatedRoute, private _router: Router, private breadcrumb: BreadcrumbsService, private categorieData: CategoriedataService, private bcService: BreadcrumbsService) {
    this.activatedRoute.params.subscribe(params => {
        this.pageActuelURL = params.ref;
      },
      error => {
        console.log('Erreur gestion de page ', error)
      },
    );
  }
  onRatingChanged(rating){
    console.log(rating);
    this.rating = rating;
  }
  public categoriePourFil: Categorie;

  ngOnInit() {
    this.affichage();
    this.arrayPhotoUrl = [];
    this.produitBusiness.subject.subscribe(
      (result) => {
        this._router.navigate(['/produit/1']);

      }
    );
  }

  /**
   * Pour le fil d'ariane, permet de choisir une catégorie du produit (celle avec l'id la plus petite)
   * @param {Produit} produit le produit dont on cherche le fil d'ariane des catégories
   * @returns {Categorie} la catégorie choisie du produit, celle avec l'id la plus petite.
   */
  public choixCategorie(produit: Produit): Categorie {

    // Aller chercher la catégorie du produit
    const cat = this.bcService.getBreadCrumb(this.produit);

    return cat;
  }



  async affichage() {
    this.promiseProduit = this.produitBusiness.getProduitByRef(this.pageActuelURL);
    await this.promiseProduit.then(
      (value) => {
        this.produit = value;
        this.arrayPhotoUrl=[];
        for (const photo of this.produit.arrayPhoto) {
          this.arrayPhotoUrl.push(photo.url+'_'+this.image.nativeElement.clientHeight+'x'+this.image.nativeElement.clientWidth);
        }

      }
    );
    this.promiseAvis = this.avisService.getAvis(this.produit);
    this.promiseAvis.then(
      (value) => {
        this.produit.avis = value;
        console.log(this.produit);
      }
    );
  }

  public ajoutAvis(description : string){
    if(description === undefined || description.length===0){
      this.snackBar.open('Veuillez renseigner une description', '', {
        duration: 2000
      });
    }else {
      this.avisService.ajoutAvis(new Avis(0,description,this.rating,undefined,this.produit.ref));
      this.produit.avis.push(new Avis(0,description,this.rating,undefined,this.produit.ref));
      this.snackBar.open('Avis ajouté', '', {
        duration: 2000
      });
    }

  }

  public generateRowIndexes(index:number){
    let indexes = [];
    for(let i = 0; i<5;i++){
     
      if(index-i >= 1){
        indexes.push('star');
      }else if(index-i >= 0.5){
        indexes.push('star_half');
      }else{
        indexes.push('star_border');
      }
      
    }
    return indexes;
  }
}



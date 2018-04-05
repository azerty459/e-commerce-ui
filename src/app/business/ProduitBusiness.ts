import { Observable } from 'rxjs/Rx';
import { Produit } from "../models/Produit";
import {Injectable} from "@angular/core";
import {Http, Response} from "@angular/http";

var API_URL = "http://localhost:8080/graphql";

@Injectable()
export class ProduitBusiness {
  constructor(private http: Http) {}

  private handleError (error: Response | any) {
    console.error('ApiService::handleError', error);
    return Observable.throw(error);
  }

  getProduit(): Observable<Produit[]> {
    return this.http.post(API_URL, { query: '{getAllProduit{referenceProduit description prixHT}}'})
      .map(response => {
        const produits = response.json().getAllProduit;
        return produits.map((produit) => new Produit(produit.referenceProduit, produit.description, produit.prixHT));
      })
      .catch(this.handleError);
  }
}

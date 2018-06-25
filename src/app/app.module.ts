import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatButtonModule,
  MatIconModule,
  MatCardModule,
  MatToolbarModule,
  MatMenuModule,
  MatInputModule,
  MatFormFieldModule,
  MatSidenavModule,
  MatSelectModule,
  MatTooltipModule,
  MatStepperModule,
  MatSortModule,
  MatSnackBarModule,
  MatSlideToggleModule,
  MatSliderModule,
  MatRippleModule,
  MatRadioModule,
  MatProgressSpinnerModule,
  MatProgressBarModule,
  MatPaginatorModule,
  MatNativeDateModule,
  MatListModule,
  MatTableModule,
  MatTabsModule,
  MatAutocompleteModule,
  MatCheckboxModule,
  MatButtonToggleModule,
  MatDatepickerModule,
  MatDialogModule,
  MatChipsModule,
  MatDividerModule,
  MatExpansionModule,
  MatGridListModule,
  MatTreeModule
} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { ProduitComponent } from './components/produit/page.produit.component';
import {HttpModule} from '@angular/http';
import { AccueilComponent } from './components/accueil/accueil.component';
import {ProduitBusiness} from '../../e-commerce-ui-common/business/produit.service';
import { DetailProduitComponent } from './components/detail-produit/detail-produit.component';
import {PreviousRouteBusiness} from '../../e-commerce-ui-common/business/previous-route.service';
import {RetourComponent} from '../../e-commerce-ui-common/utilitaires/retour/retour.component';
import { HttpClientModule } from '@angular/common/http';

import { FormsModule } from '@angular/forms';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import {ArbreService} from "../../e-commerce-ui-common/business/arbre.service";
import {CategorieBusinessService} from "../../e-commerce-ui-common/business/categorie.service";
import {MenuItemComponent} from "./components/menu-item/menu-item.component";

const appRoutes: Routes = [
  {
    path: 'produit',
    redirectTo: 'produit/1'},
  {
    path: 'produit/:page',
    component: ProduitComponent,
    data: { title: 'e-commerce - Produits' }
  },
  {
    path: 'produit/:page;nbMsg=:nbMsg',
    component: ProduitComponent,
    data: { title: 'e-commerce - Produits' }
  },
  {
    path: 'accueil',
    component: AccueilComponent,
    data: { title: 'e-commerce - Accueil' }
  },
  { path: '',
    redirectTo: '/produit/1',
    pathMatch: 'full'
  },
  {
    path: 'produit/detail/:ref',
    component: DetailProduitComponent,
    data: { title: 'e-commerce - Detail produit' }
  }
  // { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    ProduitComponent,
    AccueilComponent,
    DetailProduitComponent,
    RetourComponent,
    BreadcrumbComponent,
    MenuItemComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    NgbModule.forRoot(),
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false } // <-- debugging purposes only
    ),
    BrowserAnimationsModule,
    MatCardModule,
    HttpClientModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatSidenavModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule, // Angular tree
    FlexLayoutModule,
    MatChipsModule
  ],
  providers: [ProduitBusiness, PreviousRouteBusiness, ArbreService, CategorieBusinessService],
  bootstrap: [AppComponent]
})
export class AppModule { }

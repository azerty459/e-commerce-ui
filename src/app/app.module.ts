import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatButtonModule, MatIconModule, MatCardModule, MatToolbarModule, MatMenuModule, MatInputModule,
  MatFormFieldModule, MatSidenavModule, MatSelectModule, MatTooltipModule, MatStepperModule, MatSortModule, MatSnackBarModule,
  MatSlideToggleModule, MatSliderModule, MatRippleModule, MatRadioModule, MatProgressSpinnerModule, MatProgressBarModule,
  MatPaginatorModule, MatNativeDateModule, MatListModule, MatGridListModule, MatTableModule, MatTabsModule, MatAutocompleteModule,
  MatCheckboxModule, MatButtonToggleModule, MatChipsModule, MatDatepickerModule, MatDialogModule, MatDividerModule, MatExpansionModule
} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { ProduitComponent } from './components/produit/page.produit.component';
import {HttpModule} from '@angular/http';
import { AccueilComponent } from './components/accueil/accueil.component';
import {ProduitBusiness} from "../../e-commerce-ui-common/business/produit.business";


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
    path: 'accueil',
    component: AccueilComponent,
    data: { title: 'e-commerce - Accueil' }
  },
  { path: '',
    redirectTo: '/produit/1',
    pathMatch: 'full'
  }
  // { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    ProduitComponent,
    AccueilComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    NgbModule.forRoot(),
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false } // <-- debugging purposes only
    ),
    BrowserAnimationsModule,
    MatCardModule,
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
    MatChipsModule,
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
    FlexLayoutModule,
  ],
  providers: [ProduitBusiness],
  bootstrap: [AppComponent]
})
export class AppModule { }

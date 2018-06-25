import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NavItem} from './nav-item';
import {CategorieNode} from "../../../../e-commerce-ui-common/models/CategorieNode";
import {AppComponent} from "../../app.component";
import {MatMenuTrigger} from "@angular/material";

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss']
})
export class MenuItemComponent implements OnInit {
  @Input() items: NavItem[];
  @ViewChild('childMenu') public childMenu;


  constructor(public router: Router, public parent:AppComponent) {
  }

  ngOnInit() {
  }
  public selectCategorie(item: CategorieNode){
    this.parent.selectCategorie(item);
  }
}

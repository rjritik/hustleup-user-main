import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchbarComponent } from '../header/searchbar/searchbar.component';
import { RightmenuComponent } from '../header/rightmenu/rightmenu.component';
import { NavbarsubComponent } from '../header/navbarsub/navbarsub.component';
import { NavbarComponent } from  '../header/navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClickOutsideModule } from 'ng-click-outside';
import { ThousandcounterModule } from '../../modules/thousandcounter/thousandcounter.module';
import { NgSelect2Module } from 'ng-select2';

@NgModule({
  declarations: [
    SearchbarComponent,
    RightmenuComponent,
    NavbarsubComponent,
    NavbarComponent,
    HeaderComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    ClickOutsideModule,
    ThousandcounterModule,
    NgSelect2Module
  ],
  exports:[
    HeaderComponent,
    NavbarsubComponent
  ]
})
export class HeaderModule{ }

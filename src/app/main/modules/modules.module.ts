import 'froala-editor/js/plugins.pkgd.min.js';
import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModulesComponent } from './modules.component';
import { HeaderModule } from '../shared/header/header.module';
import { AddproductComponent } from '../modules/addproduct/addproduct.component';
import { BlogsComponent  } from '../modules/blogs/blogs.component';
import { BloguploadComponent  } from '../modules/blogupload/blogupload.component';
import { ExploreComponent  } from '../modules/explore/explore.component';
import { HashtagsComponent  } from '../modules/hashtags/hashtags.component';
import { HomeComponent  } from '../modules/home/home.component';
import { ImagesuploadComponent  } from '../modules/imagesupload/imagesupload.component';
import { MapComponent } from '../modules/map/map.component';
import { VideosComponent } from '../modules/videos/videos.component';
import { VideouploadComponent } from '../modules/videoupload/videoupload.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

import { SaveItemComponent } from './save-item/save-item.component';
import { MusicDetailsComponent } from './music-details/music-details.component';
import { OtherUserProfileComponent } from './other-user-profile/other-user-profile.component';
import { ContactComponent } from './contact/contact.component';
import { BrandApprovalComponent } from './brand-approval/brand-approval.component';
import { BottommessageboxModule } from '../../main/shared/bottommessagebox/bottommessagebox.module';
import { MinimizepopModule } from '../../main/shared/minimizepop/minimizepop.module';
import { NgSelect2Module } from 'ng-select2';
import { AuthGuard } from '../auth/helpers/auth.guard';
import { AddProductGuard } from '../auth/helpers/add-product.guard';
import { MatNativeDateModule } from '@angular/material/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OwlModule } from 'ngx-owl-carousel';
import { DateAgoPipe } from './date-ago.pipe';
import { NumberFormatPipe } from './number-format.pipe';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { NgxSpinnerModule } from "ngx-spinner";
import { NgxTagsInputBoxModule } from "ngx-tags-input-box";
import { MatChipsModule} from "@angular/material/chips";
import { MatIconModule} from "@angular/material/icon";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { ThousandcounterModule} from '../modules/thousandcounter/thousandcounter.module';
import { ScrollingModule} from '@angular/cdk/scrolling';
import { ImageCropperModule } from 'ngx-image-cropper';
import { HorizontalScrollMenuModule } from 'ngx-horizontal-scroll-menu';
import { LyImageCropperModule } from '@alyle/ui/image-cropper';
import { LyButtonModule } from '@alyle/ui/button';
import { LyIconModule } from '@alyle/ui/icon';
import { LySliderModule } from '@alyle/ui/slider';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';
import { environment } from 'src/environments/environment';
import { EmbedComponent } from './embed/embed.component';
import { MatDialogModule } from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

const routes:Routes = [
  {
    path:'',
    component:ModulesComponent,
    children:[
      { path:'', redirectTo:'/home', pathMatch:'full'},
      { path:'home', component:HomeComponent,canActivate: [AuthGuard]},
      { path:'imgpost', component:HomeComponent,canActivate: [AuthGuard]},
      { path:'addproduct', component:AddproductComponent,canActivate: [AuthGuard,AddProductGuard]},
      { path:'blog', component:BlogsComponent,canActivate: [AuthGuard]},
      { path:'singleblog', component:BlogsComponent,canActivate: [AuthGuard]},
      { path:'blog-upload', component:BloguploadComponent,canActivate: [AuthGuard]},
      { path:'explore', component:ExploreComponent,canActivate: [AuthGuard]},
      { path:'hastags', component:HashtagsComponent,canActivate: [AuthGuard]},
      { path:'images-upload', component:ImagesuploadComponent,canActivate: [AuthGuard]},
      { path:'video', component:VideosComponent,canActivate: [AuthGuard]},
      { path:'singlevideo', component:VideosComponent,canActivate: [AuthGuard]},
      { path:'video-upload', component:VideouploadComponent,canActivate: [AuthGuard]},
      { path:'hashtags-details', loadChildren:() => import('./hastags-details/hashtags-details.module').then(m=>m.HashtagsDetailsModule)},
      { path:'product', loadChildren:() => import('./product/product.module').then(m=>m.ProductModule)},
      // { path:'hastags-details',component:HastagsDetailsComponent,canActivate: [AuthGuard]},
      // { path:'product', component:ProductComponent,canActivate: [AuthGuard]},
      { path:'saved-items', component:SaveItemComponent,canActivate: [AuthGuard]},
      { path:'music-details', component:MusicDetailsComponent,canActivate: [AuthGuard]},
      { path:'user-profile-visit', component:OtherUserProfileComponent,canActivate: [AuthGuard]},
      { path:'contact', component:ContactComponent,canActivate: [AuthGuard]},
      { path:'brand-approval', component:BrandApprovalComponent,canActivate: [AuthGuard]}
    ]
  },
  {
    path:'map',
    component:MapComponent
  },
  {
    path:'embed/:id',
    component:EmbedComponent
  }
] 

@NgModule({
  declarations: [HomeComponent,AddproductComponent,BlogsComponent,BloguploadComponent,ExploreComponent,HashtagsComponent,ImagesuploadComponent,
    MapComponent,VideosComponent,VideouploadComponent, SaveItemComponent, MusicDetailsComponent, OtherUserProfileComponent, ContactComponent, ModulesComponent, BrandApprovalComponent, DateAgoPipe, NumberFormatPipe, EmbedComponent],
  imports: [
    SharedModule,
    CommonModule,
    HeaderModule,
    BottommessageboxModule,
    MinimizepopModule,
    NgSelect2Module,
    RouterModule.forChild(routes),
    MatNativeDateModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    OwlModule,
    PickerModule,
    NgxSpinnerModule,
    NgxTagsInputBoxModule,
    MatChipsModule,
    MatIconModule,
    MatAutocompleteModule,
    ThousandcounterModule,
    ScrollingModule,
    ImageCropperModule,
    HorizontalScrollMenuModule,
    DragDropModule,
    LyImageCropperModule,
    LyButtonModule,
    LyIconModule,
    LySliderModule,
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot(),
    Ng2SearchPipeModule,
    NgxMapboxGLModule.withConfig({
      accessToken: environment.mapbox.accessToken
    }),
    MatDialogModule,
    MatButtonModule,
    InfiniteScrollModule
  ],
  exports: [RouterModule],
})
export class ModulesModule {}
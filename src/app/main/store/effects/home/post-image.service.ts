import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { RootReducerState } from '../../reducers';
import { HomeService } from 'src/app/main/modules/home/home.service';
import { PostImageAdd, PostImageError, PostImageRequest, PostImageSuccess } from '../../actions/home/postImage-action';
import { getPostImageData, getPostImageError, getPostImageLoaded, getPostImageLoading } from '../../selectors/home/postImage-selector';

@Injectable({
  providedIn: 'root'
})
export class PostImageService {

  constructor(private _store:Store<RootReducerState>,private _homeService:HomeService) { }

  getPostImage(limitProduct:any){
    const loading$ = this._store.select(getPostImageLoading);
    const loaded$ = this._store.select(getPostImageLoaded);
    const error$ = this._store.select(getPostImageError);
    const data$ = this._store.select(getPostImageData);

    combineLatest([loaded$,loading$]).subscribe(data=>{ 
        if(!data[0] && !data[1]){
            this._store.dispatch(new PostImageRequest());
            this._homeService.getAllPostImages(limitProduct).subscribe((res:any)=>{
                const data = res.data;
                console.log(data, '  getAllPostImages--data');
                this._store.dispatch(new PostImageSuccess({data}));
            },
            (err)=>{
                this._store.dispatch(new PostImageError());
            });
        }
    });
    return [loading$, loaded$, error$,data$];
  }

  addPostImage(data:any){
    console.log('addpostImage from postImageService ',data);
    this._store.dispatch(new PostImageAdd({data}))
  }

  // getPostImageById(data:any){
  //   this._store.dispatch(new PostImageById({data}));
  // }
}

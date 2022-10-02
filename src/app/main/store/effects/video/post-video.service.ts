import { Injectable } from '@angular/core';
import { VideosService } from 'src/app/main/modules/videos/videos.service';
import { Store } from '@ngrx/store';
import { RootReducerState } from '../../reducers';
import { PostVideoActionTypes, PostVideoError, PostVideoRequest, PostVideoSuccess } from '../../actions/video/postVideo';
import { getPostVideoLoading, getPostVideoLoaded,getPostVideoError,getPostVideoData } from '../../selectors/video/postVideo-selector';
import { combineLatest } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class PostVideoService {

  constructor(private _videosService:VideosService, private _store:Store<RootReducerState>) { }

  getPostVideo(force = false){
    const loading$ = this._store.select(getPostVideoLoading);
    const loaded$ = this._store.select(getPostVideoLoaded);
    const error$ = this._store.select(getPostVideoError);
    const data$ = this._store.select(getPostVideoData);
  
    combineLatest([loaded$,loading$]).subscribe(data=>{
      if((!data[0] && !data[1]) || force){
        this._store.dispatch(new PostVideoRequest());
        // this._videosService.getAllPostVideo().subscribe((res:any)=>{
        //   const data = res.data;
        //   this._store.dispatch(new PostVideoSuccess({data}));
        // },(err=>{
        //   console.log(err);
        //   this._store.dispatch(new PostVideoError());
        // }))
      }      
    })

    return [loading$,loaded$,error$,data$]

  }

}

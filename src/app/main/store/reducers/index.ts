import { ActionReducerMap } from '@ngrx/store'
import * as fromPostImage from './home/postImage-reducer'
import * as fromPostVideo from './video/postVideo-reducer'

export  interface RootReducerState{
    postImage: fromPostImage.PostImageReducerState
    postVideo: fromPostVideo.PostVideoReducerState
}   

export const rootReducer:ActionReducerMap<RootReducerState> ={
    postImage:fromPostImage.PostImageReducer,
    postVideo:fromPostVideo.PostVideoReducer
}

export const getPostImageState = (state:RootReducerState) => state.postImage;
export const getPostVideoState = (state:RootReducerState) => state.postVideo;
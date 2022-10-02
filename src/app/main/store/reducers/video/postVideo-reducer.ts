import { Action } from '../../actions'
import { PostVideoActionTypes } from '../../actions/video/postVideo';

export interface PostVideoReducerState{
    loading:boolean;
    loaded:boolean;
    error:boolean;
    postVideoData:any;
}

const initialState: PostVideoReducerState = {
    loading:false,
    loaded:false,
    error:false,
    postVideoData:[]
}

export function PostVideoReducer(state = initialState, action:Action):PostVideoReducerState{
    switch (action.type) {
        case PostVideoActionTypes.POST_VIDEO_REQUEST:
            return{...state,loading:true}
        case PostVideoActionTypes.POST_VIDEO_SUCCESS:
            const videodata = state.postVideoData.concat(action.payload.data);
            return{...state,loaded:true,loading:false,postVideoData:videodata}
        case PostVideoActionTypes.POST_VIDEO_ERROR:
            return{...state,loading:false,error:true}
        default:
            return state;
    }
}

// reducer values...

export const getLoading = (state:PostVideoReducerState) => state.loading;
export const getLoaded = (state:PostVideoReducerState) => state.loaded;
export const getError = (state:PostVideoReducerState) => state.error;
export const getPostVideo = (state:PostVideoReducerState) => state.postVideoData;
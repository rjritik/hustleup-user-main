import { Action } from '../../actions'
import { PostImageActionTypes } from '../../actions/home/postImage-action';

export interface PostImageReducerState{
    loading:boolean;
    loaded:boolean;
    error:boolean; 
    postImageData:any;
}

const initialState: PostImageReducerState = {
    loading:false,
    loaded:false,
    error:false,
    postImageData:[]
}
export function PostImageReducer(state = initialState,action:Action):PostImageReducerState{
    switch(action.type){
        case PostImageActionTypes.POST_IMAGE_REQUEST:{
            return{ ...state,loading:true }
        }
        case PostImageActionTypes.POST_IMAGE_SUCCESS:{
            // const data = state.postImageData.concat(action.payload.data);
            return{ ...state,loading:false,loaded:true,error:false,postImageData:action.payload.data }
        }
        case PostImageActionTypes.POST_IMAGE_ERROR:{
            return{...state,loading:false,error:true}
        }
        case PostImageActionTypes.POST_IMAGE_ADD:{
            console.log('state.postImageData',state.postImageData);
            const data = state.postImageData.concat(action.payload.data).sort(function(a:any,b:any){return new Date(b.created_date).getTime() - new Date(a.created_date).getTime()});
            console.log(' action.payload.data-POST_IMAGE_ADD ', action.payload.data);
            console.log(' from post image reducer ', data);
            return{...state,...{postImageData:data}}    
        }
        // case PostImageActionTypes.POST_IMAGE_BY_ID:{
        //     const data = state.postImageData;
        //     console.log(data, 'data');
        //     const id = action.payload.data;
        //     console.log(id, 'id');
        //     const single_data = data.filter((_id:any)=>{return _id === id });
        //     console.log(single_data, 'single_data ');
        //     return {...state,...{ postImageData:single_data }}
        // }
        default:{
            return state;
        }
    }
}

// reducer values..

export const getLoading = (state:PostImageReducerState) => state.loading;
export const getLoaded = (state:PostImageReducerState) => state.loaded;
export const getError = (state:PostImageReducerState) => state.error;
export const getPostImage = (state:PostImageReducerState) => state.postImageData;

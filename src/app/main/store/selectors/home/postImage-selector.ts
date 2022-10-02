import { createSelector} from "@ngrx/store";

import * as fromPostImage from "../../reducers/home/postImage-reducer"
import { getPostImageState } from "../../reducers";

export const getPostImageLoading = createSelector(getPostImageState,fromPostImage.getLoading);
export const getPostImageLoaded = createSelector(getPostImageState,fromPostImage.getLoaded);    
export const getPostImageError = createSelector(getPostImageState,fromPostImage.getError);    
export const getPostImageData = createSelector(getPostImageState,fromPostImage.getPostImage);    

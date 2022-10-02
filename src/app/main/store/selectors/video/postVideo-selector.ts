import { createSelector } from '@ngrx/store';

import * as fromPostVideo from "../../reducers/video/postVideo-reducer"
import { getPostVideoState } from "../../reducers";

export const getPostVideoLoading = createSelector(getPostVideoState,fromPostVideo.getLoading);
export const getPostVideoLoaded = createSelector(getPostVideoState,fromPostVideo.getLoaded);
export const getPostVideoError = createSelector(getPostVideoState,fromPostVideo.getError);
export const getPostVideoData = createSelector(getPostVideoState,fromPostVideo.getPostVideo); 

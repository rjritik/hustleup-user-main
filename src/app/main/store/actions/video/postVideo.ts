export enum PostVideoActionTypes {
    POST_VIDEO_REQUEST = 'post video request',
    POST_VIDEO_SUCCESS = 'post video success',
    POST_VIDEO_ERROR = 'post video error',
}

export class PostVideoRequest{
    readonly type = PostVideoActionTypes.POST_VIDEO_REQUEST;
}

export class PostVideoSuccess{
    readonly type = PostVideoActionTypes.POST_VIDEO_SUCCESS
    constructor(public payload?:{data:any}){}
}

export class PostVideoError{
    readonly type = PostVideoActionTypes.POST_VIDEO_ERROR
}
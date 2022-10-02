export enum PostImageActionTypes {
    POST_IMAGE_REQUEST = 'post image request',
    POST_IMAGE_SUCCESS = 'post image success',
    POST_IMAGE_ERROR = 'post image error',
    POST_IMAGE_ADD = 'post image add',
    // POST_IMAGE_BY_ID = 'post image by id'
}

export class PostImageRequest{
    readonly type = PostImageActionTypes.POST_IMAGE_REQUEST;
}

export class PostImageSuccess{
    readonly type = PostImageActionTypes.POST_IMAGE_SUCCESS;
    constructor(public payload?:{data:any}){}
}

export class PostImageError{
    readonly type = PostImageActionTypes.POST_IMAGE_ERROR;
}

export class PostImageAdd{
    readonly type = PostImageActionTypes.POST_IMAGE_ADD;
    constructor(public payload?:{data:any}){}
}

// export class PostImageById{
//     readonly type = PostImageActionTypes.POST_IMAGE_BY_ID;
//     constructor(public payload?:{data:any}){}
// }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CommentsComponent} from './comments/comments.component';
import { DirectmessageComponent} from './directmessage/directmessage.component';
import { DoneComponent} from './done/done.component';
import { MessagesubComponent} from './messagesub/messagesub.component';
import { PublicchannelComponent} from './publicchannel/publicchannel.component';
import { SpamComponent} from './spam/spam.component';
import { YourchannelComponent} from './yourchannel/yourchannel.component';
import { WithoutLoginComponent } from './without-login/without-login.component';
import { RequestJoinComponent } from './request-join/request-join.component';
import { MessageComponent } from './message.component';
import { HeaderModule } from '../../shared/header/header.module';
import { MessagerightmenuModule } from '../../shared/messagerightmenu/messagerightmenu.module';
import { MinimizepopModule } from '../../shared/minimizepop/minimizepop.module';
import { BottommessageboxModule } from '../../shared/bottommessagebox/bottommessagebox.module';
import { ChannelcreateboxModule } from '../../shared/channelcreatebox/channelcreatebox.module';
import { AuthGuard } from '../../auth/helpers/auth.guard';
import { ThousandcounterModule } from '../thousandcounter/thousandcounter.module';
import { FormsModule } from '@angular/forms';
import { OwlModule } from 'ngx-owl-carousel';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MessageReplyComponent  } from '../../shared/message-reply/message-reply.component';
import { ChannelUpdatesComponent  } from '../../shared/channel-updates/channel-updates.component';
import { ChannelDiscussionsComponent  } from '../../shared/channel-discussions/channel-discussions.component';
import { ChannelMessageReplyComponent  } from '../../shared/channel-message-reply/channel-message-reply.component';

import { ClickOutsideModule } from 'ng-click-outside';
import { PostImageCommentComponent } from './comments/post-image-comment/post-image-comment.component';
import { PostBlogCommentComponent } from './comments/post-blog-comment/post-blog-comment.component';
import { PostVideoCommentComponent } from './comments/post-video-comment/post-video-comment.component';
import { PostProductCommentComponent } from './comments/post-product-comment/post-product-comment.component';
import { PostImageCommentReplyComponent } from './comments/post-image-comment-reply/post-image-comment-reply.component';
import { PostBlogCommentReplyComponent } from './comments/post-blog-comment-reply/post-blog-comment-reply.component';
import { PostVideoCommentReplyComponent } from './comments/post-video-comment-reply/post-video-comment-reply.component';
import { PostProductCommentReplyComponent } from './comments/post-product-comment-reply/post-product-comment-reply.component';


const routes:Routes = [
  {
    path:'',
    component:MessageComponent,
    children:[ 
      {
        path:'',
        redirectTo:'/message/messages',
        pathMatch:'full'
      },
      {
        path:'without-login',
        component:WithoutLoginComponent,
        canActivate: [AuthGuard]
      },
      {
        path:'request-join',
        component:RequestJoinComponent,
        canActivate: [AuthGuard]
      },
      {
        path:'comments',
        component:CommentsComponent,
        canActivate: [AuthGuard]
      },
      {
        path:'directmessage',
        component:DirectmessageComponent,
        canActivate: [AuthGuard]
      },
      {
        path:'done',
        component:DoneComponent,
        canActivate: [AuthGuard]
      },
      {
        path:'messages',
        component:MessagesubComponent,
        canActivate: [AuthGuard]
      },
      {
        path:'publicchannel',
        component:PublicchannelComponent,
        canActivate: [AuthGuard]
      },
      {
        path:'spam',
        component:SpamComponent,
        canActivate: [AuthGuard]
      },
      {
        path:'privatechannel',
        component:YourchannelComponent,
        canActivate: [AuthGuard]
      },          
    ]
  },
]

@NgModule({
  declarations: [
    WithoutLoginComponent,
    RequestJoinComponent,
    CommentsComponent,
    DirectmessageComponent,
    DoneComponent,
    MessagesubComponent,
    PublicchannelComponent,
    SpamComponent,
    YourchannelComponent,
    MessageComponent,
    MessageReplyComponent,
    ChannelUpdatesComponent,
    ChannelDiscussionsComponent,
    ChannelMessageReplyComponent,
    PostImageCommentComponent,
    PostBlogCommentComponent,
    PostVideoCommentComponent,
    PostProductCommentComponent,
    PostImageCommentReplyComponent,
    PostBlogCommentReplyComponent,
    PostVideoCommentReplyComponent,
    PostProductCommentReplyComponent
  ],
  imports: [
    CommonModule,
    HeaderModule,
    MessagerightmenuModule,
    MinimizepopModule,
    BottommessageboxModule,
    ChannelcreateboxModule,
    ThousandcounterModule,
    FormsModule,
    OwlModule,
    PickerModule,
    RouterModule.forChild(routes),
    InfiniteScrollModule,
    ClickOutsideModule
  ]
})
export class MessageModule{}
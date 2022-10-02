import { Component, OnInit, ViewChildren } from '@angular/core';
import { SharedService } from 'src/app/main/shared/shared.service';
import { PaginationDirective } from 'src/app/main/directives/pagination.directive';
import { ImagesuploadService } from '../../imagesupload/imagesupload.service';
import { UserRolesService } from './user-roles.service';

@Component({
  selector: 'app-user-roles',
  templateUrl: './user-roles.component.html',
  styleUrls: ['./user-roles.component.css']
})
export class UserRolesComponent implements OnInit {
  GetUserRolesList:any=[];
  userrolesmain = true;
  adduserroles = false;
  showuserdataboolean:boolean = false;
  selecteduserpopup:boolean = false;
  useradded:boolean = true;
  selecteduserdata:any;
  SearchedUserName:any;
  usersearchdata:any = [];
  selecteduserid:any;
  MakeAdmin:boolean = false;
  NotAvailUserRole:boolean = false;
  addnewuserboolean:boolean = true;
  RemoveUserlink = false;
  SelectedRemoveItem:any;
  MainSearchedText:any='';
  AddedUserID:any;
  roleid:any;
  PageNo:any;
  limit:any;
  totalPages:any;
  nextPage:any;
  hasNextPage:any
  prevPage:any;
  hasPrevPage:any;

  Userpermission = [
    {
      module: "post",
      createRole: false,
      viewRole: false,
      viewEditRole: false,
      deleteRole: false
    },
    {
      module: "video",
      createRole: false,
      viewRole: false,
      viewEditRole: false,
      deleteRole: false
    },
    {
      module: "blog",
      createRole: false,
      viewRole: false,
      viewEditRole: false,
      deleteRole: false
    },
    {
      module: "message",
      createRole: false,
      viewRole: false,
      viewEditRole: false,
      deleteRole: false
    },
    {
      module: "profile",
      createRole: false,
      viewRole: false,
      viewEditRole: false,
      deleteRole: false
    },
    {
      module: "product",
      createRole: false,
      viewRole: false,
      viewEditRole: false,
      deleteRole: false
    },
    {
      module: "order",
      createRole: false,
      viewRole: false,
      viewEditRole: false,
      deleteRole: false
    },
    {
      module: "payment",
      createRole: false,
      viewRole: false,
      viewEditRole: false,
      deleteRole: false
    }
  ]

  constructor(private _UserRolesService:UserRolesService,
              private _SharedService: SharedService,
              private _ImagesuploadService:ImagesuploadService) { }

  ngOnInit(): void {
    this.GetUserRole()
  }

  GetUserList(){
    if(this.SearchedUserName.trim() != ''){
      this.usersearchdata = [];
      this.showuserdataboolean = true;
      const data = {
        pattern:this.SearchedUserName.trim(),
        role:3
      };
      this._ImagesuploadService.getUsersList(data).subscribe((res:any)=>{
        if(res.status == 200){
          const a = this.GetUserRolesList.map((item:any)=>{
             return item.userId;
        });
          res.data.map((item:any)=>{
            if(a.includes(item._id)){
            }else{
              this.usersearchdata.push(item);
            }
          });
        }
        if(res.status == 500){
          this._SharedService.errorToast(res.message)
        }
      });
    }
  }

  adduserdata(item:any){
    this.SearchedUserName = item.username
    this.showuserdataboolean = false;
    this.selecteduserdata = item
  }

  AddUser(){
    if(this.SearchedUserName !='' && this.SearchedUserName != undefined){
      if(this.selecteduserdata.username.includes(this.SearchedUserName)){
        this.AddedUserID=this.selecteduserdata._id
        this.selecteduserpopup = true;
        this.useradded = false;
        this.showuserdataboolean = false;
        this.RemoveUserlink = true;
        this.SearchedUserName=undefined;
      }
    }
  }

  RemoveUser(){
    this.selecteduserdata = undefined;
    this.selecteduserpopup = false;
    this.useradded = true;
  }

  async GetUserRole(){
    const data = {
      pattern:this.MainSearchedText,
      page: this.PageNo == undefined ? 1 : this.PageNo,
      limit:  this.limit == undefined ? 10:this.limit
    }
    this._UserRolesService.GetAllRoles(data).subscribe((res:any)=>{
      if(res.status == 200){
        this.GetUserRolesList = res.data.docs
        this.PageNo = res.data.page
        this.limit = res.data.limit
        this.totalPages = res.data.totalPages
        this.nextPage = res.data.nextPage
        this.prevPage = res.data.prevPage
        this.hasNextPage = res.data.hasNextPage
        this.hasPrevPage = res.data.hasPrevPage
        if(this.MainSearchedText == ''){
          if(this.GetUserRolesList.length <= 0){
            this.NotAvailUserRole = true;
          }else{
            this.NotAvailUserRole = false;
          }
        }else{
          this.MainSearchedText = ''
        }
      }
      if(res.status == 500){
        this._SharedService.errorToast(res.message)
      }
      if(res.status == 401){
        this._SharedService.errorToast(res.message)
      }
    })
  }

  addnewuserroles(){
    this.userrolesmain = false;
    this.adduserroles = true;
    this.addnewuserboolean = true;
    this.useradded = true;
    this.showuserdataboolean = false;
    this.selecteduserpopup = false;
    this.RemoveUserlink = false;
  }

  userrolescancel(){
    this.userrolesmain = true;
    this.adduserroles = false;
    this.addnewuserboolean = true;
    this.selecteduserpopup = false;
    this.RemoveUserlink = false;
    this.clear()
  }

  savechange(){
    if(this.AddedUserID != undefined){
      const data ={
        userId: this.AddedUserID,
        isAdmin: this.MakeAdmin,
        permission:this.Userpermission
      }
      this._UserRolesService.AssignRole(data).subscribe((res:any)=>{
        if(res.status == 200){
          this.userrolesmain = true;
          this.adduserroles = false;
          this.clear()
          this.GetUserRole()
          this._SharedService.successToast(res.message)
        }
        if(res.status == 500){
          this._SharedService.errorToast(res.message) 
        }
        if(res.status == 400){
          this._SharedService.errorToast(res.message)
        }
        if(res.status == 401){
          this._SharedService.errorToast(res.message)
        }
      })
    }else{
      this._SharedService.errorToast("Add User Required")
    }
  }

  clear(){
    this.selecteduserpopup = false;
    this.useradded = false;
    this.usersearchdata = [];
    this.selecteduserdata = undefined;
    this.SearchedUserName = undefined;
    this.AddedUserID = undefined;
    this.RemoveUserlink = false;
    this.MakeAdmin = false;
    this.MainSearchedText=''
    this.Userpermission = [
      {
        module: "post",
        createRole: false,
        viewRole: false,
        viewEditRole: false,
        deleteRole: false
      },
      {
        module: "video",
        createRole: false,
        viewRole: false,
        viewEditRole: false,
        deleteRole: false
      },
      {
        module: "blog",
        createRole: false,
        viewRole: false,
        viewEditRole: false,
        deleteRole: false
      },
      {
        module: "message",
        createRole: false,
        viewRole: false,
        viewEditRole: false,
        deleteRole: false
      },
      {
        module: "profile",
        createRole: false,
        viewRole: false,
        viewEditRole: false,
        deleteRole: false
      },
      {
        module: "product",
        createRole: false,
        viewRole: false,
        viewEditRole: false,
        deleteRole: false
      },
      {
        module: "order",
        createRole: false,
        viewRole: false,
        viewEditRole: false,
        deleteRole: false
      },
      {
        module: "payment",
        createRole: false,
        viewRole: false,
        viewEditRole: false,
        deleteRole: false
      }
    ]
  }

  Edit(item:any){
    this.RemoveUserlink = false;
    this.userrolesmain = false;
    this.adduserroles = true;
    this.addnewuserboolean =false;
     this.useradded = false;
     this.selecteduserpopup = true;
     this.selecteduserdata = item.userDetails
    this.roleid = item._id
    this.Userpermission=item.permission
    this.MakeAdmin = item.isAdmin
  }

  Update(){
    // if(this.selecteduserdata != undefined){
      const data ={
        roleId:this.roleid,
        isAdmin: this.MakeAdmin,
        permission: this.Userpermission
      }
      this._UserRolesService.UpdateRole(data).subscribe((res:any)=>{
        if(res.status == 200){
          this.userrolesmain = true;
          this.adduserroles = false;
          this.GetUserRole()
          this.clear()
          this._SharedService.successToast(res.message)
        }
        if(res.status == 500){
          this._SharedService.errorToast(res.message) 
        }
        if(res.status == 400){
          this._SharedService.errorToast(res.message)
        }
        if(res.status == 401){
          this._SharedService.errorToast(res.message)
        }
      })
    // }else{
    //   this._SharedService.errorToast("User Required")
    // }
  }

  RemoveClick(item:any){
    this.SelectedRemoveItem = item;
  }

  ConfirmRemove(){
    const data = {
      roleId:this.SelectedRemoveItem._id
    }
    this._UserRolesService.DeleteRole(data).subscribe((res:any)=>{
      if(res.status == 200){
        this.GetUserRole()
        this._SharedService.successToast(res.message)
      }
      if(res.status == 500){
        this._SharedService.errorToast(res.message)
      }
      if(res.status == 400){
        this._SharedService.errorToast(res.message)
      }
      if(res.status == 401){
        this._SharedService.errorToast(res.message)
      }
    })
  }


  // for paginatiom
  SelectItemsPerPage(event:any){
    this.limit = event.target.value
    this.GetUserRole()
  }
  onFirst(){
    if(this.hasPrevPage  == true){
      this.PageNo = 1
      this.GetUserRole()
    }
  }

  onPrevious(){
    if(this.hasPrevPage  == true){
      this.PageNo = this.prevPage
      this.GetUserRole()
    }
  }

  onNext(){
    if(this.hasNextPage  == true){
      this.PageNo = this.nextPage
      this.GetUserRole()
    }
  }

  onLast(){
    if(this.hasNextPage  == true){
      this.PageNo = this.totalPages
      this.GetUserRole()
    }
  }

}

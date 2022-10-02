import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserRolesService {

  constructor(private _HttpClient:HttpClient) {}

  GetAllRoles(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/usersRoles/getAllRole`,data)
  }

  AssignRole(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/usersRoles/assignRole`,data);
  }

  UpdateRole(data:any){
    return this._HttpClient.patch(`${environment.apiUrl}/usersRoles/updateRolePermission`,data);
  }

  DeleteRole(data:any){
    return this._HttpClient.post(`${environment.apiUrl}/usersRoles/deleteRole`,data);
  }
}

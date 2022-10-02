import { Role } from './role';

export class User {
  countryCode:string;    
  email: string;
  message: string;
  mobile: string;
  role: Role;
  token?: string;
  username:string;
}
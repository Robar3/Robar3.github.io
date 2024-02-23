export interface ClientsInterface {
  users:Array<User>
}
export interface User{
  name: string;
  surname: string;
  phone: string;
  email: string;
}
export interface UserWithId{
  id:string;
  name: string;
  surname: string;
  phone: string;
  email: string;
}

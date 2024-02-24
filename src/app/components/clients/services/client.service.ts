import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ClientsInterface} from "../interfaces/client-interfase";

@Injectable({
  providedIn: "root"
})
export class ClientService {

  constructor(private http: HttpClient) { }

  getData(){
   return this.http.get<ClientsInterface>("https://test-data.directorix.cloud/task1")
  }
}

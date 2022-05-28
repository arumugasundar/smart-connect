import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  public backendUrl = "https://smart-connect-backend-app.herokuapp.com";
  // public backendUrl = "http://localhost:3000";

  constructor(
    private http: HttpClient,
    private _router:Router
  ) { }

  getInitialEvents(newsType: any){
    return this.http.get<[]>(this.backendUrl + '/api/dashboard/getInitialEvents/'+ newsType);
  }

  getPrevEvents(id: any, newsType: any){
    return this.http.get<[]>(this.backendUrl + '/api/dashboard/getPrevEvents/'+ id +'/'+ newsType);
  }

  getNextEvents(id: any, newsType: any){
    return this.http.get<[]>(this.backendUrl + '/api/dashboard/getNextEvents/'+ id +'/'+ newsType);
  }
}

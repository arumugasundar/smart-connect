import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  // public backendUrl = "https://money-wiser-backend.herokuapp.com";
  public backendUrl = "http://localhost:3000";

  constructor(
    private http: HttpClient,
    private _router:Router
  ) { }

  getTransactions(){
    return this.http.get<[]>(this.backendUrl + '/api/budget/getTransactions');
  }
}

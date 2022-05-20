import { Component, OnInit } from '@angular/core';
import {FormControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router'
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginFormGroup: FormGroup; // Container to store actual form details
  hide = true; //used to toggle between hide and visible in password field

  constructor(
    private formBuilder: FormBuilder,
    public authService: AuthService,
    private _snackBar: MatSnackBar,
    private _router : Router
  ) {
    /* To Instantiate the form with controls */
    this.loginFormGroup = this.formBuilder.group({
      email: new FormControl(null, {validators: [Validators.required,Validators.email]}),
      password: new FormControl(null, {validators: [Validators.required]}),
    });
  }

  /* To get values to frontend for validation purpose */
  get f() {
    if(this.loginFormGroup!=null)
      return this.loginFormGroup.controls;
    return;
  }

  /* To display alert messages */
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  /* To check the form validity and call backend to store data */
  login(){
    if(this.loginFormGroup != null)
      if (this.loginFormGroup.invalid)
        this.openSnackBar("Invalid Credentials!!!", "Ok");
      else{
        console.log(this.loginFormGroup.value);
        this.authService.login(this.loginFormGroup.value).subscribe((response) => {

          if(response.message){
            this.openSnackBar(response.message, "Ok");
          }

          if(response.token){
            console.log(response);
            localStorage.setItem('token', response.token);
            this._router.navigate(['/dashboard']).then(() => {
              console.log("Navigated to dashboard!");
            });
          }

        }, (err: any) => {
            console.log(err);
            this.openSnackBar(err.toString(), "Ok");

          }
        );
      }
  }

  ngOnInit(): void {
    if(this.authService.isLoggedIn()){
      this._router.navigate(['/dashboard']).then(() => {
        console.log("Navigated to dashboard!");
      });
    }
  }

}

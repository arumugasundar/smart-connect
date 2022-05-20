import { Component, OnInit } from '@angular/core';
import {FormControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router'
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerFormGroup: FormGroup; // Container to store actual form details
  hide = true; //used to toggle between hide and visible in password field

  constructor(
    private formBuilder: FormBuilder,
    public authService: AuthService,
    private _snackBar: MatSnackBar,
    private _router : Router) {
    /* To Instantiate the form with controls */
    this.registerFormGroup = this.formBuilder.group({
      name: new FormControl(null, {validators: [Validators.required, Validators.pattern('[A-Za-z0-9 ]{3,32}')]}),
      email: new FormControl(null, {validators: [Validators.required,Validators.email]}),
      password: new FormControl(null, {validators: [Validators.required,Validators.pattern("(?=^.{8,}$)((?=.*\\d)|(?=.*\\W+))(?![.\\n])(?=.*[A-Z])(?=.*[a-z]).*$")]}),
      confirmPassword: new FormControl(null, {validators: [Validators.required,Validators.pattern("(?=^.{8,}$)((?=.*\\d)|(?=.*\\W+))(?![.\\n])(?=.*[A-Z])(?=.*[a-z]).*$")]})
    });
  }

  /* To get values to frontend for validation purpose */
  get f() {
    if(this.registerFormGroup!=null)
      return this.registerFormGroup.controls;
    return;
  }

  /* To display alert messages */
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  /* To check the form validity and call backend to store data */
  register(){
    if(this.registerFormGroup != null)
      if (this.registerFormGroup.invalid)
        this.openSnackBar("Invalid Credentials!!!", "Ok");
      else if (this.registerFormGroup.value.password != this.registerFormGroup.value.confirmPassword)
        this.openSnackBar("Password Mismatched!!!", "Ok");
      else {
        this.authService.register(
          this.registerFormGroup.value.name,
          this.registerFormGroup.value.email,
          this.registerFormGroup.value.password
        ).subscribe((response) => {
          if(response.message){
            this.openSnackBar(response.message, "Ok");
          }
          this._router.navigate(['/login']).then(() => {
            console.log("Navigated to Login!");
          });
          }, (err: any) => {
            console.log(err);
            if (err instanceof HttpErrorResponse)
              if (err.status === 401)
                this.openSnackBar("Email Id Already Registered!!!", "Ok");
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

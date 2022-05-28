import { Component, OnInit, ViewChild } from '@angular/core';
import { AppService } from '../../services/app.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router'
import { MatOption } from '@angular/material/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public events:any = [];
  public newsType = 0;

  public searchForm: FormGroup;
  public newsTypeFilters = [{ key:1, value:'Positive'},{ key:2, value:'Critical'}];
  @ViewChild('allNewsTypeSelected') private allNewsTypeSelected: MatOption | undefined;

  constructor(
    public appService: AppService,
    private _snackBar: MatSnackBar,
    private _router : Router,
    private newsTypeFormBuilder: FormBuilder
  ) {
    this.searchForm = this.newsTypeFormBuilder.group({
      newsType: new FormControl('')
    });
  }

  ngOnInit(): void {
    this.getInitialEvents();
  }

  updateNews(){
    let selectedKeys = this.searchForm.controls['newsType'].value;
    console.log(selectedKeys);
    if(selectedKeys.length > 0){
      if(selectedKeys.includes(0)){
        this.newsType = 0;
      }else if(selectedKeys.includes(1)){
        console.log('reached 1');
        this.newsType = 1;
      }else if(selectedKeys.includes(2)){
        this.newsType = 2;
      }
      this.getInitialEvents();
    }
  }

  togglePerNewsType(){
    if (this.allNewsTypeSelected && this.allNewsTypeSelected.selected) {
      this.allNewsTypeSelected.deselect();
      return false;
     }
     if(this.searchForm.controls['newsType'].value.length==this.newsTypeFilters.length && this.allNewsTypeSelected)
       this.allNewsTypeSelected.select();
    return true;
  }

  toggleAllNewsTypes(){
    if (this.allNewsTypeSelected && this.allNewsTypeSelected.selected) {
      let newsTypes = this.newsTypeFilters.map(item => item.key);
      newsTypes.push(0);
      this.searchForm.controls['newsType']
        .patchValue(newsTypes);
    } else {
      this.searchForm.controls['newsType'].patchValue([]);
    }
  }

  getInitialEvents(){
    this.appService.getInitialEvents(this.newsType).subscribe((response) => {
      if(response){
        console.log(response);
        this.events = [...response];
      }
    }, (error) => {
      console.log(error);
    });
  }

  onScrollDown(){
    console.log('ScrollDown event');
    this.appService.getNextEvents(this.events[this.events.length-1]._id, this.newsType).subscribe((response) => {
      if(response){
        console.log(response.length, ' new records appended to the end.');
        this.events = this.events.concat(response);
        if(this.events.length > 40){
          this.events = this.events.splice(20,this.events.length);
        }
      }
    }, (error) => {
      console.log(error);
    });
  }

  onScrollUp(){
    console.log('ScrollUp event');
    this.appService.getPrevEvents(this.events[0]._id, this.newsType).subscribe((response) => {
      if(response){
        console.log(response.length, ' new records appended to the begining.');
        const newEvents = response;
        this.events = newEvents.concat(this.events);
        if(this.events.length > 40){
          this.events = this.events.splice(0,20);
        }
      }
    }, (error) => {
      console.log(error);
    });
  }

  loadNextEvents(){

  }

}

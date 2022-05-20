import { Component, OnInit } from '@angular/core';
import { AppService } from '../../services/app.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router'
import { ChartOptions } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public transactionData = [];
  public income =  0.00;
  public expenses = 0.00;
  public balance = 0.00;

  public expensesBasedChartColors: Array<any> = [
    {
      backgroundColor:[
        'rgba(75, 192, 192, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 99, 132, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(255, 205, 86, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(201, 203, 207, 0.2)'
      ],
      borderColor: [
        'rgb(75, 192, 192)',
        'rgb(54, 162, 235)',
        'rgb(255, 99, 132)',
        'rgb(255, 159, 64)',
        'rgb(255, 205, 86)',
        'rgb(153, 102, 255)',
        'rgb(201, 203, 207)'
      ],
      borderWidth: 1
  }];
  public expensesBasedChartData = [];
  public expensesBasedChartLabels = [];
  public expensesBasedChartOptions: ChartOptions = {
    responsive: true,
  };
  public expensesBasedChartPlugins = [];
  public expensesBasedChartLegend = true;
  public expensesBasedChartType = 'pie';

  constructor(
    public appService: AppService,
    private _snackBar: MatSnackBar,
    private _router : Router
  ) { }

  ngOnInit(): void {
    this.getTransactions();
  }

  getTransactions(){
    this.appService.getTransactions().subscribe((response) => {
      if(response){
        this.transactionData = response;
        this.income = 0.00;
        this.expenses = 0.00;
        this.balance = 0.00;
        for(let i = 0; i < this.transactionData.length; i++){
          this.income += parseFloat(this.transactionData[i]['deposit']['$numberDecimal']);
          this.expenses += parseFloat(this.transactionData[i]['withdraw']['$numberDecimal']);
        }
        this.balance = this.income - this.expenses;
      }
    }, (error) => {
      console.log(error);
    });
  }

}

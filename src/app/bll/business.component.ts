import { Component, OnInit, Injectable} from '@angular/core';
import {Http} from '@angular/http'

@Injectable()
export class BusinessLogic {
  UpdateLoanAmountInProcessCheck(getProccessCheck,LoanPMTAmount, Loan):any{
    getProccessCheck = new Array<any>()
    getProccessCheck.forEach(element => {
      if(element.Loan == Loan){
        console.log('Found: ' + element.Loan)
        element.AmountPaid = LoanPMTAmount
      }
    });
  }
}
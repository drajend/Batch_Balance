
// IMPORTANT NOTE:
// In Environment.Dev.ts, set the Development to true when debbuging and set back to false before deploying to Dev
// Otherwise the Close, Done, Approve and Deny buttons will not exit/close

import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core'
import { Http, Response } from '@angular/http'
import { BbapiService } from "../services/bbapi.service"
import { environment } from "../../environments/environment.qa"
import { IEProcessBatch } from '../model/IProcessBatch'
import { LocalDataSource } from 'ng2-smart-table'
import { ViewCell } from 'ng2-smart-table'
import { ActivatedRoute } from '@angular/router'
import { DatePipe } from '@angular/common';
import { CurrencyPipe } from '@angular/common';
import { AppComponent } from 'app/app.component';
import { CommonUtility } from 'app/utility/common.component'
import { DataTable, DataTableResource } from '../data-table';
import { elementAt } from 'rxjs/operator/elementAt';
import { DataSource } from 'ng2-smart-table/lib/data-source/data-source';
import { Element } from '@angular/compiler';
import { Row } from 'ng2-smart-table/lib/data-set/row';
import { asElementData } from '@angular/core/src/view';

@Component({
  encapsulation: ViewEncapsulation.Emulated,
  selector: 'app-process-batch',
  templateUrl: './process-batch.component.html',
  styleUrls: ['./process-batch.component.css'],
  providers: [BbapiService, CurrencyPipe, CommonUtility]
})

export class ProcessBatchComponent implements OnInit {

  //Declare variables
  
  getProcBatchData
  getProccessCheck:Array<any>=[]
  setProccessCheck:Array<any>=[] 
  getPLPBatchData = new Array<any>();
  getBatchInfoDT
  findSourceData
  getRepayPLPData
  unlockResult
  ResultData
  source: LocalDataSource
  sourceCheckView: LocalDataSource
  dataService: any
  lbxid: any
  lbxdate: any
  lbxbatch: any
  itemsbatch: any
  batchCompleted: any
  batchTotal: any
  selectedEntities: any[]
  imageViewer: any
  lbxAmount: any
  totalbatchAmount
  totalCheckAmount
  setClickedRow: Function
  index
  indexCheckView
  selectedRow
  modifiedStatus: any 
  noChanges:boolean 

  AWDObjectId: any
  getAWDObjId: any
  SourceObjId
  sourceAWDObjId: any
  BatchInfoObjectId: any
  BatchInfoLoanAmount: any
  ssnSearch: string
  accountSearch: string
  loanSearch: string
  firstnameSearch: string
  lastnameSearch: string
  AmountPaid: any
  loanSearchAccount: any

  LockboxCV: any
  LockboxDateCV: any
  BatchCV: any
  ItemCV: any
  chkAmount: any
  TotalAmount
  Difference
  monthName
  
  // take out payment
  initItemAmountPaid   //added for defect # 1293
  selfltAmountPaid     //added for defect # 1293

  delLockbxid         // use for take out payment
  delLbxdate          // use for take out payment
  delLbxbatch         // use for take out payment
  delItemCV           // use for take out payment
  
  takeOutPayment:boolean=false;

// method name
  methodName:any

// selected Item details
  selSSN  
  selAccount 
  selLoanStat  
  selLoan  
  
  processStatus:boolean

  paramLbxID  
  paramLbxdate 
  paramLbxbatch  
  paramItemCV  
  // 

  bbServiceAWDObjId 
  bbServicegetUserId

  pbbResource: any
  cvResource: any
  pbbCount = 0
  cvCount = 0
  cntr = 0
  initBatchItemNumber = 0


  plpbbCount = 0;
  plpcvCount = 0;
  plpbbResource

  ProcessBatchAmount: number = 0
  CurrentBatchNo: any
  headerTitleProcBatch: any
  headerCheckView: any
  itemsProcBatch = []

  isOpenCheck: boolean
  isCheckView: boolean
  isProcessBatch: boolean
  
  insertResult
  deleteResult
  updateResult

  PaymentType
  UserId

  ReferralResult
  currentSSN
  currentAccount
  currentLoan
  blnFound: boolean
  appId
  rowSelect
  msgTitleToolip: string = "To update the Table, press Enter key after input on Amount Paid."

  // for JSONFile
  jsFile = {}

  // jsAccount: string
  // jsAcStat: string
  // jsAmountPaid: number
  // jsLastPayAmt:number
  // jsLoan:number
  // jsLoanStat:string
  // jsName:string
  // jsNextPayAmt:number
  // jsPayoffAmt:number
  // jsSingleMultiLoan:string
  // jsSSN:string
  
  //Panels settings 
  d = {
    dir: 'vertical',
    gutterSize: 15,
    width: null,
    height: null,
    size1: 85,
    size2: 15
  }

  constructor(private commonUtility?: CommonUtility, private currencyPipe?: CurrencyPipe, private bbservices?: BbapiService, private http?: Http, private route?: ActivatedRoute) {
    this.rowColors = this.rowColors.bind(this);
  }

  ngOnInit() {

    //Initialize variables
    let monthName = { 1: "Jan", 2: "Feb", 3: "Mar", 4: "Apr", 5: "May", 6: "Jun", 7: "Jul", 8: "Aug", 9: "Sep", 10: "Oct", 11: "Nov", 12: "Dec" }
    this.headerTitleProcBatch = "Process Batch"
    this.headerCheckView = this.msgTitleToolip
    this.rowSelect = 0
    this.index = 0
    this.cntr = 0
    this.lbxid = this.commonUtility.parseLocation(window.location.search)['lbxid']
    this.lbxdate = this.commonUtility.parseLocation(window.location.search)['lbxdate'];
    this.lbxbatch = this.commonUtility.parseLocation(window.location.search)['batchId'];
    this.AWDObjectId = this.commonUtility.parseLocation(window.location.search)['awdobjId'];
    this.UserId = this.commonUtility.parseLocation(window.location.search)['UserID'];

    console.log("lbxid: " + this.lbxid)
    console.log("lbxdate: " + this.lbxdate)
    console.log("lbxbatch: " + this.lbxbatch)
    console.log("AWDObjectId: " + this.AWDObjectId)
    console.log("UserId: " + this.UserId)

    this.indexCheckView = 0
    this.imageViewer = ""
    this.getProcBatchData = new Array<any>()
    // this.getProccessCheck = new Array<{}>()
    this.getPLPBatchData = new Array<any>()
    this.getProccessCheck = new Array<any>()
    this.setProccessCheck = null
    this.findSourceData = new Array<any>()

    this.isOpenCheck = false
    this.isCheckView = true
    this.isProcessBatch = false
    this.processStatus = false
    
    this.insertResult = new Array<any>()
    this.deleteResult = new Array<any>()
    this.updateResult = new Array<any>()
    this.ReferralResult = new Array<any>()
    this.getRepayPLPData = new Array<any>()
    this.unlockResult = new Array<any>()
    this.ResultData = new Array<any>()
    
    // this.splitAccount = new Array<any>()
    
    this.appId = environment.AppId

    var currentStartDate = new Date().toLocaleDateString()
    var currentEndDate = new Date().toLocaleDateString()
    var lbdate = new Date(this.lbxdate);
    var dd = lbdate.getDate();
    var mname = monthName[lbdate.getMonth() + 1] //because January is 0! 
    var yyyy = lbdate.getFullYear()
    var batchInfoLbxDate: any;

    this.setClickedRow = function (index) { this.selectedRow = index; }

    this.source = new LocalDataSource()
    this.sourceCheckView = new LocalDataSource()
    this.PaymentType = ""

    this.currentSSN = ""
    this.currentAccount = ""
    this.currentLoan = ""
    this.batchCompleted = 0

    //document.getElementById('progBatch').innerText = '50%';
    //On loading, invoke getBatchInfo service

    batchInfoLbxDate = dd + "-" + mname + "-" + yyyy
    this.getBatchInfo(this.lbxid, batchInfoLbxDate, this.lbxbatch)

    if (this.BatchInfoObjectId == this.AWDObjectId) {
      console.log("This batch was not found in the database.")
    }
    else if (this.itemsbatch == "0") {
      console.log("The AWD object ID from the database is not the same as this batch.")
    }
    else {

      //Invoke the getProcBatchGrid service. this populate the grid    
      this.getProccessCheck = null
      this.setProccessCheck = null

      let urlbb = environment.GetProcBatchGridAPI + '?id=' + this.lbxid + '&lbxdate=' + this.lbxdate + '&batchId=' + this.lbxbatch
      this.bbservices.getProcBatchGrid(this.lbxid, this.lbxdate, this.lbxbatch)
        .subscribe((djson) => {
          this.source.load(djson);
          this.getProcBatchData = djson;
          console.log("getProcBatchData");
          console.log(this.getProcBatchData);
          this.pbbResource = new DataTableResource(this.getProcBatchData);
          this.pbbResource.count().then(count => this.pbbCount = count);

          var totalAmountBatch: number = 0
          var batchCompletedTotalAmount: number = 0

          this.getProcBatchData.forEach(element => {
            if ((element.Modified == "true") || (element.Amount == element.PLPTotal)) {
              batchCompletedTotalAmount += parseFloat(element.Amount)
              this.processStatus = true;
            }

            totalAmountBatch += parseFloat(element.Amount)

            // defect 1272
            if (this.cntr == 0) {
              this.initBatchItemNumber = element.BatchItemNumber
              console.log("this.cntr: " + this.initBatchItemNumber);
              this.cntr++
            }

          });

          this.totalbatchAmount = totalAmountBatch.toFixed(2)
          this.batchCompleted = batchCompletedTotalAmount.toFixed(2)
          this.UserId = this.UserId == undefined ? environment.DefaultUserId : this.UserId

        });

      console.log("currentStartDate: " + currentStartDate)
      console.log("currentEndDate: " + currentEndDate)

    }
  }

  updateBatchUserId(LockboxId, LockboxDate, BatchId, UpdateUserId) {
    this.bbservices.updateBatchUserId(LockboxId, LockboxDate, BatchId, UpdateUserId)
      .subscribe(
        (data) => { console.log('UpdateBatchUserId: ' + data[0].Result) },
        (error) => alert('UpdateBatchUserId Method Error Encountered: ' + error)
      );
  }

  //Invoke UpdateTimeAccess service
  updateAccessTime(NewFlag, LockboxId, LockboxDate, BatchId, UpdateUserId, StartDate, EndDate, AccessType, Processed) {
    this.bbservices.updateAccessTime(NewFlag, LockboxId, LockboxDate, BatchId, UpdateUserId, StartDate, EndDate, AccessType, Processed)
      .subscribe(
        (data) => { console.log('UpdateAccessTime: ' + data[0].Result) },
        (error) => alert('UpdateAccessTime Method Error Encountered: ' + error)
      );
  }

  validateSearch(): any {
    var rtnRes: string
    if (this.ItemCV == "") {
      rtnRes = "Item is empty"
    }
    else if (this.BatchCV == "") {
    }
  }

  //Invoke when Search button pressed
  getLoanData() {

    //These objects are declared above and defined in HTML thru NgModel
    var vrssnSearch = this.ssnSearch == undefined ? "" : this.ssnSearch;
    var vraccountSearch = this.accountSearch == undefined ? "" : this.accountSearch;
    var vrloanSearch = this.loanSearch == undefined ? "" : this.loanSearch;
    var vrfnameSearch = this.firstnameSearch == undefined ? "" : this.firstnameSearch;
    var vrlnameSearch = this.lastnameSearch == undefined ? "" : this.lastnameSearch;

    var fltLastPayAmt: number = 0
    var fltAmountPaid: number = 0
    var fltDifference: number = 0

    if ((vrlnameSearch.length == 1 || vrlnameSearch.length == 2)) {
      alert("Please enter in Last Name at least minimum of 3 letters to speed-up the Search.")
      return
    }
    
    if ((vrfnameSearch.length == 1 || vrfnameSearch.length == 2)) {
      alert("Please enter in First Name at least minimum of 3 letters to speed-up the Search. ")
      return
    }

    this.currentSSN = ""
    this.currentAccount = ""
    this.currentLoan = ""

    var fltAmountPaid: number = 0
    var loannum: number = 0
    var recomputeTotalPaid: number = 0
    var acctId

    //Invoke the getLoanData service

    console.log("getLoanData");

    console.log("vrssnSearch");
    console.log(vrssnSearch);
    console.log("vraccountSearch");
    console.log(vraccountSearch);
    console.log("vrloanSearch");
    console.log(vrloanSearch);
    console.log("vrfnameSearch");
    console.log(vrfnameSearch);
    console.log("vrlnameSearch");
    console.log(vrlnameSearch);

    this.bbservices.getLoanData(vrssnSearch, vraccountSearch, vrloanSearch, vrfnameSearch, vrlnameSearch)
      .subscribe(
        (data) => {

          console.log("data.length: " + data.length)
          if (data.length > 0) {

            this.isCheckView = false
            this.isProcessBatch = true

            // this.sourceCheckView.load(data)
            // this.getProccessCheck  = data;
            
            this.getProccessCheck = data;
            this.pushLoanData();

            if (this.getProccessCheck[0].Result == undefined) {
              this.cvResource = new DataTableResource(this.setProccessCheck);
              this.cvResource.count().then(count => this.cvCount = count);

              this.ProcessBatchAmount = this.getProcBatchData[Number(this.ItemCV) - 1].Amount
              
              this.setProccessCheck.forEach(element => {
                fltAmountPaid += Number(element.AmountPaid)
              });

              this.TotalAmount = ""

              this.bbservices.getRepayPLPs(this.lbxid, this.lbxdate, this.BatchCV, Number(this.ItemCV))
                .subscribe(
                  (data) => {
                    if (data.length > 0 || data != null || data != undefined) 
                    {
                      this.getRepayPLPData = data
                      this.getRepayPLPData.forEach(element => {
                        console.log("LoanPMTAmount: " + element.LoanPMTAmount)
                        if ((Number(element.LoanPMTAmount) > 0)) {
                          console.log("element.LoanNumber: " + Number(element.LoanNumber))
                          this.UpdateLoanAmountInProcessCheck(element.LoanPMTAmount, Number(element.LoanNumber))
                          recomputeTotalPaid += Number(element.LoanPMTAmount)
                          // this.splitPaymentTotalPaid += Number(element.LoanPMTAmount)
                        }
                      });

                      //Recompute Total Amount 
                      // rose fix 1272 comment out 
                      // fltDifference = this.ProcessBatchAmount - recomputeTotalPaid
                     
                      this.TotalAmount = recomputeTotalPaid
                      
                      // fltDifference = this.ProcessBatchAmount - this.splitPaymentTotalPaid;
                      // // this.TotalAmount = this.splitPaymentTotalPaid;
                      // this.totalCheckAmount = this.ProcessBatchAmount;
                      // this.Difference = fltDifference;
                      // console.log("this.splitPaymentTotalPaid:" + this.splitPaymentTotalPaid);

                      console.log("recomputeTotalPaid: " + recomputeTotalPaid );

                    }
                  },
                  (error) => alert('GetRepayPLPs Method Error Encountered: ' + error),
                  () => console.log('GetRepayPLPs success')
                );

              //Recompute Total Completed
              var totalCompleted: number = 0
              this.getProcBatchData.forEach(element => {
                if (element.Amount == element.PLPTotal) {
                  totalCompleted += Number(element.Amount)
                }
              })
              this.batchCompleted = totalCompleted.toFixed(2)
            }
            
            else {
              this.getProccessCheck = null
              alert('No rows found that match the search criteria.')
            }
          }
          else {
            this.getProccessCheck = null
            alert('No rows found that match the search criteria.')
          }
        },
        (error) => {
          console.log("Process Check:" + this.getProccessCheck)
          if (this.getProccessCheck == undefined || this.getProccessCheck == null) {
            this.getProccessCheck = null
            alert('No rows found that match the search criteria.')
          }
          else {
            alert('GetLoanData Method Error Encountered: ' + error)
          }
        },
        () => console.log('GetLoanData success')
      );

    if (this.getProccessCheck != undefined || this.getProccessCheck != null) {
   
    }
    else {
        //alert("No data in Process Check View.")
        this.getProccessCheck = null
    }

  }

  pushLoanData(){
            console.log("getLoanData");
            console.log(this.getProccessCheck);
           
            console.log("setProcessCheck:")
             
            if (this.setProccessCheck == null)
            {
                this.setProccessCheck = this.getProccessCheck;
                console.log("set value");
            }
            else
            {
               //this.setProccessCheck.push(this.getProccessCheck);
               this.createJsonFile();
               console.log("push value");
            }

            console.log("after adding values: setProcessCheck:");
            console.log(this.setProccessCheck);
  }

 // create Jason Data
 createJsonFile()
 {
   this.getProccessCheck.forEach(element =>
     { 
       this.jsFile = "";
       this.jsFile = {
               Account: element.Account, 
               AcStat:  element.AcStat,
               AmountPaid: element.AmountPaid,
               LastPayAmt: element.LastPayAmt,
               Loan: element.Loan,
               LoanStat: element.LoanStat,
               Name: element.Name,
               NextPayAmt: element.NextPayAmt,
               PayoffAmt: element.PayoffAmt,
               SingleMultiLoan: element.SingleMultiLoan,
               SSN: element.SSN
             }
       // var s = this.setProccessCheck.filter(element.Account);
       console.log("filter values: ");
       // console.log(s);
 
       this.setProccessCheck.push(this.jsFile);
 
   }) 
   console.log("json string");
   console.log(JSON.stringify(this.jsFile));
 }


// // create an array of Source list ID selected
// existValidation(){    
//   var index =  this.setProccessCheck.indexOf(event.target.value);        
//   if(index === -1){
//       this.selectedSrcIDList.push(event.target.value);
//       console.log(this.selectedSrcIDList);
//   }
//   else
//   {
//       this.selectedSrcIDList = this.selectedSrcIDList.splice(event.target.value,1);      
//       console.log(this.selectedSrcIDList);
//   }
// }

  // UpdateLoanAmountInProcessCheck(LoanPMTAmount, Loan) {
  //   this.getProccessCheck.forEach(element => {
  //     if (element.Loan == Loan) {
  //       console.log('Found: ' + element.Loan)
  //       element.AmountPaid = LoanPMTAmount
  //     }
  //   });
  // }

  UpdateLoanAmountInProcessCheck(LoanPMTAmount, Loan) {
    this.getProccessCheck.forEach(element => {
      if (element.Loan == Loan) {
        console.log('Found: ' + element.Loan)
        element.AmountPaid = LoanPMTAmount
      }
    });
  }

  getBatchInfo(lockboxid, lockboxdate, batchid) {
    //Invoke the getBatchInfo service
    this.bbservices.getBatchInfo(lockboxid, lockboxdate, batchid)
      .subscribe(itm => {
        if (itm[0].Result == "No Data") {
          alert("No data")
        }
        else {
          this.getBatchInfoDT = itm;
          this.getBatchInfoDT.forEach(element => {
            this.itemsbatch = element.PLOItemCount
            this.BatchInfoObjectId = element.AWDObjId
          });
        }
      },
        (error) => alert('getBatchInfo Method Error Encountered: ' + error)
      );
  }

  getRepayInfo(lbxid, lbxdate, batchid) {
    this.getProcBatchData = new Array<any>();
    this.http.get(environment.GetRepayInfoAPI + '?id=' + lbxid + '&lbxdate=' + lbxdate + '&batchId=' + batchid)
      .subscribe(
        (data) => {
          this.getProcBatchData = data.json();
        },
        (error) => alert('GetRepayInfo Method Error Encountered: ' + error)
      );
  }

  public onClickSelectBatch() {
    alert("test")
  }

  Referral() {
    var AppId = environment.AppId
    var getUserId = this.UserId == undefined ? "" : this.UserId
    var comment = "Loan Referral: "
    var LockedTo = "false"
    var AssignedTo = ""
    var DocumentId = ""
    var createcontext = environment.CreateWorkContext

    //",-,SSN,1261390,,-,POLN,382703029,,-,LOAN,156.48,"
    var fldLOB = ",-,TaxId," + this.currentSSN + ",TIN" +
      ",-,PolicyNumber," + this.currentAccount + ",POLN" +
      ",-,LoanNumber," + this.currentLoan + ",LOAN" +
      ",-,LockboxNumber," + this.LockboxCV + ",LBOX" +
      ",-,LockboxDate," + this.LockboxDateCV + ",LBDT" +
      ",-,ItemCount," + this.ItemCV + ",ITEM"

    console.log("FieldLOB: " + fldLOB)

    var createWorkId = ""
    var ParentComment = ""
    var ChildComment = ""
    if (this.currentSSN != "" && this.currentAccount != "" && this.currentLoan) {
      this.bbservices.CreateWork(AppId, getUserId, comment, LockedTo, AssignedTo, DocumentId, createcontext, fldLOB)
        .subscribe(
          (data) => {
            if (data.length > 0) {
              this.ReferralResult = data
              this.ReferralResult.forEach(element => {
                createWorkId = element.Result
                console.log("createWorkId: " + element.Result)
              });

              this.bbservices.CreateRelationship(AppId, getUserId, comment, createWorkId, this.sourceAWDObjId, ParentComment, ChildComment)
                .subscribe(
                  (data) => {
                    //this.ReferralResult = data
                  },
                  (error) => console.log('CreateRelationship Method Error Encountered: ' + error),
                  () => {
                    console.log('CreateRelationship Successfully executed')
                  }
                );
            }
            else {
              alert("Empty result")
            }
          },
          (error) => alert('Referral Method Error Encountered: ' + error),
          () => {
            console.log('Referral Successfully executed')
            alert('Referral Successfully executed. AWD Object Id: ' + createWorkId)
          }
        );
    }
    else {
          alert("You must select a row in the Loan table.")
    }
  }

  // checkDetailView() {
  //   var amtPaid: any
  //   this.getProccessCheck.forEach(element => {
  //     amtPaid += parseFloat(element.AmountPaid)
  //   });
  //   console.log('Amount: ' + amtPaid)
  // }

  checkDetailView() {
    var amtPaid: any
    this.setProccessCheck.forEach(element => {
      amtPaid += parseFloat(element.AmountPaid)
    });
    console.log('Amount: ' + amtPaid)
  }

  rowClick(rowEvent) {
    this.currentSSN = rowEvent.row.item.SSN
    this.currentAccount = rowEvent.row.item.Account
    this.currentLoan = rowEvent.row.item.Loan
  }

  updateCheckItem(event: any, item: any) {
    var fltLastPayAmt: number = 0
    var fltAmountPaid: number = 0
    var fltDifference: number = 0
    var batchCompletedTotalAmount: number = 0
    
    // console.log('AmountPaid: ' + item.AmountPaid)
    // console.log('Loan: ' + item.Loan)
    console.log("PLP Amount:" + item.PLPTotal);
    console.log("LoanStat:" + item.LoanStat);

    this.noChanges = true;
    this.takeOutPayment = false;
    
    if (parseFloat(item.AmountPaid) < 0) {
        alert('You cannot have a PLP for a negative amount.')
    }
    else {
     
      if (event.which === 13) {

        // let updateItem = this.getProccessCheck.find(x => x.PayoffAmt === item.AmountPaid)
        // fltDifference = this.ProcessBatchAmount - this.TotalAmount; 
        // this.totalCheckAmount = this.ProcessBatchAmount
        // this.Difference = fltDifference
        // added validation                       
        // modified for Defect #1293  06/05/2018

          this.selfltAmountPaid = item.AmountPaid
          console.log("PLPTotal before take out:");
          
          var ctr:number=0;
          var itemNo:number=0;
          var prevAmountPaid:Number=0; 

          this.setProccessCheck.forEach(element => {
              if (element.SSN == item.SSN && element.Account == item.Account && element.Loan == item.Loan ){
                  prevAmountPaid = element.AmountPaid
                  element.AmountPaid = item.AmountPaid
                  console.log("Amount Paid: " + element.AmountPaid)
                  itemNo=ctr;
                  console.log(itemNo);
              }
              ctr++;
            });
        
            if (Number(item.AmountPaid) == 0 && Number(prevAmountPaid) > 0) {
                this.noChanges = false;
                this.takeOutPayment = true;
            }

            if (Number(item.AmountPaid) == Number(prevAmountPaid)) {
                this.noChanges = true;
                this.takeOutPayment = false;
            }
            else
            {
               this.noChanges = false;
            } 


            // if ((this.ProcessBatchAmount > 0) && (item.AmountPaid == 0))
            if (this.ProcessBatchAmount > 0 && this.takeOutPayment == true)
            {
                    // this.takeOutPayment = true;
                    this.delLockbxid = this.lbxid;
                    this.delLbxbatch =  this.lbxbatch; 
                    this.delLbxdate = this.lbxdate;
                    this.delItemCV  = this.ItemCV;           
                    console.log("Take out payment!");
                    console.log("this.delLockbxid" + this.delLockbxid); 
                    console.log("this.delLbxbatch"+this.delLbxbatch); 
                    console.log("this.delLbxdate"+this.delLbxdate); 
                    console.log("this.delItemCV"+this.delItemCV);
            } 

        // console.log(this.setProccessCheck[Number(this.ItemCV-1)].AmountPaid);
        // this.setProccessCheck[Number(this.ItemCV-1)].AmountPaid  = this.selfltAmountPaid;
        // let updateItem = this.getProccessCheck.find(x => x.PayoffAmt === item.AmountPaid)

        console.log("PLPTotal after take out:");
        // this.setProccessCheck[itemNo].AmountPaid = item.AmountPaid;
        console.log(this.setProccessCheck[itemNo].AmountPaid);

        console.log("this.setProccessCheck:");
        console.log(this.setProccessCheck);

        //console.log(this.setProccessCheck[Number(this.ItemCV-1)].AmountPaid);

        this.computeTotalAmountCheck(); 

        this.getProcBatchData[Number(this.ItemCV) - 1].PLPTotal = this.TotalAmount
        this.getProcBatchData[Number(this.ItemCV) - 1].Modified = "true"
          
        console.log("this.getProcBatchData: ");
        console.log(this.getProcBatchData);
        console.log(this.ItemCV);
        // this.getProcBatchData[Number(this.ItemCV)].PLPTotal = this.TotalAmount
        // this.getProcBatchData[Number(this.ItemCV)].Modified = "true"  
        
        console.log( "PTP Total:"); 
        console.log(this.getProcBatchData[Number(this.ItemCV)]);

        //Recompute Total Completed
        this.getProcBatchData.forEach(element => {
          if ((element.Modified == "true") || (element.Amount == element.PLPTotal)) {
            console.log("PLPTotal: " + parseFloat(element.PLPTotal))
            console.log("AmountPaid: " + parseFloat(element.Amount))
            // Update modified status 
            element.Modified = "true"
            // Update batch compeleted Total Amount
            batchCompletedTotalAmount += parseFloat(element.PLPTotal)
          }
        });
            this.batchCompleted = batchCompletedTotalAmount.toFixed(2)
      }
    }
  }

  computeTotalAmountCheck() {

    var fltAmountPaid: number = 0
    var fltDifference: number = 0

    // this.getProccessCheck.forEach(element => {
    //     fltAmountPaid += Number(element.AmountPaid)
    //     console.log("fltAmountPaid: " + element.AmountPaid)
    // });
  
    this.setProccessCheck.forEach(element => {
        fltAmountPaid += Number(element.AmountPaid)
        console.log("fltAmountPaid: " + element.AmountPaid)
    });

    // console.log("Total Amount Paid: " + fltAmountPaid)

    fltDifference = this.ProcessBatchAmount - fltAmountPaid     // Remaining Amount to be paid
    this.TotalAmount = fltAmountPaid                            // Total Amount Paid
    // this.currentTotal = fltAmountPaid                           // 
    this.totalCheckAmount = this.ProcessBatchAmount
    this.Difference = fltDifference

  }

  // getTotalAMount(){
  //   this.splitPaymentTotalPaid=0;
  //   // this.splitSSN = false;
  //   this.currentTotal = 0;
  // }

  saveCheckDetail() {

    var amtPaid: any
    var failedInsert: boolean = false
    var failedDelete: boolean = false

    // comment out for testing
    if (this.takeOutPayment == false)
    {
      this.paramLbxID = this.lbxid;
      this.paramLbxdate = this.lbxdate;
      this.paramLbxbatch = this.lbxbatch;
      this.paramItemCV =  this.ItemCV;
    } 
    else
    {
      this.paramLbxID = this.delLockbxid;
      this.paramLbxdate = this.delLbxdate;
      this.paramLbxbatch = this.delLbxbatch;
      this.paramItemCV =  this.delItemCV;
    }

    //Invoke the deleteOldPLP service
    console.log("---deleteOldPLP---")
    console.log("lockbxid: " + this.lbxid)
    console.log("lbxdate: " + this.lbxdate)
    console.log("lbxbatch: " + this.lbxbatch)
    console.log("ItemCV: " + this.ItemCV)

    // this.bbservices.deleteOldPLP(this.lbxid, this.lbxdate, this.lbxbatch, this.ItemCV)
  this.bbservices.deleteOldPLP(this.paramLbxID, this.paramLbxdate,this.paramLbxbatch, this.paramItemCV)
    .subscribe(
        (data) => {
          this.deleteResult = data
          console.log("Delete Result: " + this.deleteResult[0].Result)
          console.log(data);
        },
        // (error) => {
        //   failedDelete = true;
        //   alert('deleteOldPLP Method Error Encountered: ' + error)
        // });
        (error) => {
          failedDelete = true
          alert('deleteOldPLP Method Error Encountered: ' + error)},
          () => {console.log('deleteOldPLP Successfully executed')});
 
    console.log("DeletefailedStatus: ");
    console.log(failedDelete);    

    console.log("setProcessCheck: ");
    console.log(this.setProccessCheck);
    
    if (!failedDelete) {
      //Invoke the InsertPLP service
      var findZero = this.PaymentType.substr(1, 1)
      var getUserId = this.UserId == undefined ? "" : this.UserId
      var loanNumber

      if (findZero == "0") {
          loanNumber = this.PaymentType.replace("0", "")
      }
      else {
          loanNumber = this.PaymentType
      }

      console.log("setProcessCheck: ");
      console.log(this.setProccessCheck);

      // this.getProccessCheck.forEach(element => {
      this.setProccessCheck.forEach(element => { 
          if (Number(element.AmountPaid > 0)) {
              amtPaid += parseFloat(element.AmountPaid)
              console.log("---InsertPLP---")
              console.log("Account: " + element.Account)
              console.log("Loan: " + element.Loan)
              console.log("LockboxCV: " + this.LockboxCV)
              console.log("LockboxDateCV: " + this.LockboxDateCV)
              console.log("LockboxCV: " + this.BatchCV)
              console.log("lockbxid: " + this.lbxid)
              console.log("ItemCV: " + this.ItemCV)
              console.log("sourceAWDObjId: " + this.sourceAWDObjId.replace("O01", ""))
              console.log("AmountPaid: " + element.AmountPaid)
              console.log("LoanStat: " + element.LoanStat)
              console.log("PaymentType: " + this.PaymentType)
              // console.log("LoanNumber: " + loanNumber)
              console.log("UserId: " + getUserId)
              console.log("------------------------------")

              this.bbservices.InsertPLP(element.Account, element.Loan, this.LockboxCV, this.LockboxDateCV,
              this.BatchCV, this.lbxid, this.ItemCV, this.sourceAWDObjId.replace("O01", ""), Number(element.AmountPaid), this.PaymentType, getUserId, "", loanNumber)
              .subscribe(
              (data) => {
                this.insertResult = data
                console.log("InsertPLP Result: " + this.insertResult[0].Result)
              },
              (error) => {
                failedInsert = true
                console.log('InsertPLP Method Error Encountered: ' + error)
              }
            );
        }
      });

    }

    if (!failedInsert) {
      //Invoke the UpdateRepay service
      this.bbservices.UpdateRepay(getUserId, "N", "N", "", this.LockboxCV, this.LockboxDateCV, this.BatchCV, this.ItemCV)
        .subscribe(
          (data) => {
            this.updateResult = data
            console.log("UpdateRepay Result: " + this.updateResult[0].Result)
          },
          (error) => alert('UpdateRepay Method Error Encountered: ' + error)
        );
    }

  }

  openCheck(procBatchData) {

    var procBB = new Array<any>()
    var getAWDObjId
    var getUserId = this.UserId == undefined ? environment.DefaultUserId : this.UserId

    this.methodName = "openCheck"
    this.rowSelect = procBatchData.BatchItemNumber
    
    this.bbServiceAWDObjId = null
    this.bbServicegetUserId = null

    this.noChanges = true
    this.modifiedStatus = "No" 
    this.CurrentBatchNo = procBatchData.BatchItemNumber

     if (Number(this.initBatchItemNumber)>1){
            this.CurrentBatchNo = Number(this.CurrentBatchNo - (this.initBatchItemNumber-1))
            console.log("ItemBatchNumber: ");
            console.log(this.CurrentBatchNo);
     }
          
    this.ProcessBatchAmount = procBatchData.Amount

    this.setProccessCheck = null;
    this.getProccessCheck = null;
    this.takeOutPayment = false;

    //if (this.initBatchItemNumber)

    console.log();
    if (Number(procBatchData.PLPTotal) == Number(procBatchData.Amount)){
        this.modifiedStatus = "Yes";
    }
    else{
        this.modifiedStatus = "No";
    }
     
    // this.splitSSN = false;
    // this.currentTotal = 0;
     
    console.log(' procBatchData.AWDObjId:' + procBatchData.AWDObjId)
    console.log('ProcessBatchAmount:' + this.ProcessBatchAmount)
    console.log('GetUserId:' + getUserId)
    console.log('this.CurrentBatchNo:' +  this.CurrentBatchNo)
    console.log("procBatchData")
    console.log("this.modifiedStatus: "+this.modifiedStatus)
    console.log(procBatchData)

    this.d.size1 = 5
    this.d.size2 = 95

    this.clearObjects()
    this.clearCheckViewFields()
    
    // get data
    this.bbServiceAWDObjId = procBatchData.AWDObjId
    this.bbServicegetUserId = getUserId
    this.serviceCallFindSource(procBatchData.AWDObjId,procBatchData.BatchItemNumber,procBatchData.Amount)

  }

serviceCallFindSource(AWDSourceId,ItemNumber,Amount){   
 
  var  getUserId = this.UserId == undefined ? environment.DefaultUserId : this.UserId

     this.bbservices.findSource(AWDSourceId + "T01", "ALIP", getUserId)
      .subscribe(
        (data) => {
          this.findSourceData = data
          data.forEach(element => {
            this.sourceAWDObjId = element.SourceId
            console.log("element.SourceId:" + element.SourceId);
          });

          this.imageViewer = ""
          console.log('ImageRetrieve: ' + environment.ImageViewerAPI + "=" + this.sourceAWDObjId)
          this.imageViewer = environment.ImageViewerAPI + "=" + this.sourceAWDObjId

          if (this.methodName == "openCheck"){
              this.lbxAmount = Amount
              console.log("openCheck");
          }
          
          this.ItemCV = ItemNumber
          this.totalCheckAmount = Amount

          if (this.methodName == "nextProcessBatch"){

              console.log("nextProcessBatch");
           
              this.CurrentBatchNo = ItemNumber
              this.ProcessBatchAmount = this.getProcBatchData[Number(this.ItemCV) - 1].Amount
              this.totalCheckAmount = this.ProcessBatchAmount
              this.Difference = this.ProcessBatchAmount - this.TotalAmount
              this.isOpenCheck = true

          }
          
          this.LockboxCV = this.lbxid
          this.LockboxDateCV = this.lbxdate
          this.BatchCV = this.lbxbatch

          // this.ItemCV = procBatchData.BatchItemNumber

          if (Number(this.initBatchItemNumber)>1){
            this.ItemCV = Number(this.ItemCV - (this.initBatchItemNumber-1))
            console.log("ItemBatchNumber: ");
            console.log(this.ItemCV);
          }
          
          console.log("ItemBatchNumber: ");
          console.log(this.ItemCV);

          this.totalCheckAmount = Amount
          //this.Difference = this.ProcessBatchAmount - this.TotalAmount
          this.isOpenCheck = true
          this.isCheckView = false

        },
        (error) => {
            if (this.findSourceData == undefined) {
              this.isOpenCheck = false // enable the button on Done and Close Process Batch Balance
              this.isCheckView = true  // hide the Check View detail after done 
              //Clear Check View Fields
              // this.clearObjects()
              alert('findSource Error Encountered: ' + error)
            }
            else {
              alert('findSource Error Encountered: ' + error)
            }
        },
        () => console.log('success')
        // (error) => alert('openCheck Method Error Encountered: ' + error),
        // () => console.log('success')
      );
  }

  // call GetBatchPLP
  GetBatchPLP(){   
    var currentStartDate = new Date().toLocaleDateString()
    var currentEndDate = new Date().toLocaleDateString()
    var batchInfoLbxDate
    var lbdate = new Date(this.lbxdate);
    var dd = lbdate.getDate();
    var mname = this.monthName[lbdate.getMonth() + 1]; //because January is 0! 
    var yyyy = lbdate.getFullYear();
    batchInfoLbxDate = dd + "-" + mname + "-" + yyyy

    if(this.BatchInfoObjectId == this.AWDObjectId){
      console.log("This batch was not found in the database.")
    }
    else if(this.itemsbatch == "0"){
      console.log("The AWD object ID from the database is not the same as this batch.")
    }
    else{
      //Invoke the getProcBatchGrid service. this populate the grid    
      this.getProccessCheck = null  
      this.setProccessCheck = null
      
      this.bbservices.GetBatchPLPs(this.lbxid, batchInfoLbxDate, this.lbxbatch)
      .subscribe((djson) => {
        //this.source.load(djson);
        console.log("Json Data: ");
        console.log(djson);

        this.getPLPBatchData = djson;
        this.plpbbResource = new DataTableResource(this.getPLPBatchData);
        this.plpbbResource.count().then(count => this.plpbbCount = count);
        
        var totalAmountBatch:number=0
        this.getPLPBatchData.forEach(element => {
          totalAmountBatch += parseFloat(element.LoanPMTAmount)
          console.log("object id: "+element.AWDObjId);  
          console.log("Loan PMT Amount: ");
          console.log(element.LoanPMTAmount);
        });

        this.totalbatchAmount = totalAmountBatch.toFixed(2)
        console.log("Total Batch Amount: " + this.totalbatchAmount);

      });

      console.log("currentStartDate: " + currentStartDate)
      console.log("currentEndDate: " + currentEndDate)

    }
  }

  closeWindow() {
    var dvProcess = parent.document.getElementById("dvProcess")
    //alert("Close Pressed")
    if (dvProcess != undefined) {
      dvProcess.style.display = "none"
    }
    else {
      parent.window.open('', '_self', ''); parent.window.close();
    }
  }

  nextBatch() {

    var AWDSourceId
    var rtnRes
    var nextItem = 0
    var getUserId = this.UserId == undefined ? "" : this.UserId

    if (this.modifiedStatus=='Yes' && this.noChanges == true){
        rtnRes = true;        
    }
    else{
        rtnRes = this.validateCheckView()
    }

    if (!rtnRes) {
      // this.isOpenCheck = false // enable the button on Done and Close Process Batch Balance
      // this.isCheckView = true  // hide the Check View detail after done
      this.modifiedStatus=false;
      console.log("!rtnRes");
      console.log(rtnRes);
      return
    }
    else {
      console.log("nextItem: " + nextItem)
      console.log("AWDSourceId: " + AWDSourceId)
      this.cntr = this.cntr + 1;
      nextItem = parseInt(this.CurrentBatchNo) + 1
      this.rowSelect = nextItem
      AWDSourceId = this.getCurrentBatch(nextItem)
  
      if (AWDSourceId != "" || AWDSourceId != undefined) {
     
        //Save Process Check View
        //localStorage.setItem(this.sourceAWDObjId, JSON.stringify(test));

      if (this.noChanges == true)
      {
          this.saveCheckDetail()
      }
       
        //Clear Check View Fields
        this.clearCheckViewFields()
        console.log("clearCheckViewFields Successful ")
        console.log("CurrentBatchNo: " + this.CurrentBatchNo)

        this.nextProcessBatch(nextItem, getUserId)
        
      }
      else {

        console.log("AWDSourceId EOD")
        this.isOpenCheck = false // enable the button on Done and Close Process Batch Balance
        this.isCheckView = true  // hide the Check View detail after done 

        //Clear Check View Fields
        this.clearObjects()
        this.d.size1 = 80
        this.d.size2 = 20

      }
    }
    // this.splitSSN = false;
    this.modifiedStatus=false;
  }

  nextProcessBatch(nextItem, getUserId) {
    nextItem = parseInt(this.CurrentBatchNo) + 1
    var NextSourceId = this.getCurrentBatch(nextItem)
    this.methodName = "nextProcessBatch"

    if (NextSourceId == "") {
      this.isOpenCheck = false // enable the button on Done and Close Process Batch Balance
      this.isCheckView = true  // hide the Check View detail after done 
      this.clearObjects()
      this.d.size1 = 80
      this.d.size2 = 20
      return
    }
    
    this.serviceCallFindSource(NextSourceId,nextItem,"");
  
  }


  // nextProcessBatch(nextItem, getUserId) {
  //   nextItem = parseInt(this.CurrentBatchNo) + 1
  //   var NextSourceId = this.getCurrentBatch(nextItem)
  //   if (NextSourceId == "") {
  //     this.isOpenCheck = false // enable the button on Done and Close Process Batch Balance
  //     this.isCheckView = true  // hide the Check View detail after done 
  //     this.clearObjects()
  //     this.d.size1 = 80
  //     this.d.size2 = 20
  //     return
  //   }
  //   this.bbservices.findSource(NextSourceId + "T01", "ALIP", getUserId)
  //     .subscribe(
  //       (data) => {
  //         this.findSourceData = data
  //         this.findSourceData.forEach(element => {
  //           this.sourceAWDObjId = element.SourceId
  //         });
  //         this.imageViewer = ""
  //         console.log('ImageRetrieve: ' + environment.ImageViewerAPI + "=" + this.sourceAWDObjId)
  //         this.imageViewer = environment.ImageViewerAPI + "=" + this.sourceAWDObjId
  //         //this.lbxAmount = AWDSourceId.Amount

  //         this.LockboxCV = this.lbxid
  //         this.LockboxDateCV = this.lbxdate
  //         this.BatchCV = this.lbxbatch
  //         this.ItemCV = nextItem
  //         this.CurrentBatchNo = nextItem

  //         this.ProcessBatchAmount = this.getProcBatchData[Number(this.ItemCV) - 1].Amount
  //         this.totalCheckAmount = this.ProcessBatchAmount
  //         this.Difference = this.ProcessBatchAmount - this.TotalAmount
  //         this.isOpenCheck = true

  //       },
  //       (error) => {
  //         if (this.findSourceData == undefined) {
  //           this.isOpenCheck = false // enable the button on Done and Close Process Batch Balance
  //           this.isCheckView = true  // hide the Check View detail after done 

  //           //Clear Check View Fields
  //           this.clearObjects()
  //           alert('findSource Error Encountered: ' + error)
  //         }
  //         else {
  //           alert('findSource Error Encountered: ' + error)
  //         }
  //       },
  //       () => console.log('success')
  //     );
  // }

  getCurrentBatch(nextItem): any {

    var locSourceId: string = ""
    var itemNo : any

    itemNo = nextItem

    if (this.initBatchItemNumber > 1)
    {
        itemNo = (itemNo + (this.initBatchItemNumber -1) );

    }

    this.getProcBatchData.forEach(element => {
      if (element.BatchItemNumber === itemNo.toString()) {
//      if (element.BatchItemNumber === nextItem.toString()) {
        console.log('getCurrentBatch AWDObjId: ' + element.AWDObjId)
        locSourceId = element.AWDObjId
      }
    });

    console.log('locSourceId: ' + locSourceId)
    return locSourceId

  }

  doneCheckView() {
   
    if (this.takeOutPayment ==true && this.selfltAmountPaid == 0)
    {
     alert("You have taken out a payment from an account. Please make sure to enter the correct check amount!");
     return
    }

     //modified for Defect #1293  06/04/2018
    if ((Number(this.selfltAmountPaid) == 0 && this.takeOutPayment ==false)  || this.selfltAmountPaid == undefined) 
    {
          this.noChanges = true;
          console.log("this.selfltAmountPaid: "+ this.selfltAmountPaid);
          console.log("NO CHANGES");
    }  

    var rtnRes = this.validateCheckView()
    console.log("Return: " + rtnRes)

    if (rtnRes) {

      //=====  Save Process Check View
      
      console.log("saveCheckDetail: ");
     
      this.saveCheckDetail()
      this.isOpenCheck = false // enable the button on Done and Close Process Batch Balance
      this.isCheckView = true  // hide the Check View detail after done 

      //Clear Check View Fields
      this.clearObjects()
      this.d.size1 = 80
      this.d.size2 = 20
  
    }
  }

  statusResult = ""

  doneProcessBatch() {
    var noModifed: boolean = false
    var AWDComment = "BB-Proc Batch View: Batch processing finished"
    var AWDStatus  = "PROCESSED"
    var getUserId  = this.UserId == undefined ? environment.DefaultUserId : this.UserId
    //var statusResult:Boolean = false
    var outRes = ''
    var doneResult = false

    if (Number(this.batchCompleted) == 0 || this.batchCompleted == "" || this.batchCompleted == undefined) {
      console.log("You must process all checks to send the batch to quality.")
      alert("You must process all checks to send the batch to quality.")
      if (!environment.Development) {
        this.returnBack('Failed')
        var dvProcess = parent.document.getElementById("dvProcess")
        //alert("Close Pressed")
        if (dvProcess != undefined) {
          dvProcess.style.display = "none"
        }
        else {
          parent.window.open('', '_self', ''); parent.window.close();
        }
      }
      else {
        return
      }
    }

    this.getProcBatchData.forEach(element => {
      console.log("Modified: " + element.Modified)
      if (element.Modified === "false" || element.Modified === "No") {
        noModifed = true
      }
    });

    console.log("this.getProcBatchData:");
    console.log(this.getProcBatchData);
    console.log("noModifed:");
    console.log(noModifed);

    if (noModifed) {
      alert("You must process all checks to send the batch to quality.")
      if (!environment.Development) {
        this.returnBack('Failed');
        var dvProcess = parent.document.getElementById("dvProcess")
        //alert("Close Pressed")
        if (dvProcess != undefined) {
          dvProcess.style.display = "none"
        }
        else {
          parent.window.open('', '_self', ''); parent.window.close();
        }
      }
      else {
        return
      }
    }
    else {
      this.isOpenCheck = false
      console.log("AWDObjectId: " + this.AWDObjectId)
      console.log("AppId: " + this.appId)
      console.log("UserId: " + getUserId)
      console.log("AWDComment: " + AWDComment)
      console.log("AWDStatus: " + AWDStatus)

      var awdCaseId: string = this.AWDObjectId

      if (!awdCaseId.includes("C01")) {
        awdCaseId = this.AWDObjectId + "C01"
      }

      console.log("awdCaseId: " + awdCaseId)

      this.bbservices.updateCaseStatus(awdCaseId, environment.AppId, getUserId, AWDComment, AWDStatus)
        .subscribe(
          (data) => {
            this.ResultData = data[0].Result
            console.log('updateCaseStatus ResultData: ' + data[0].Result)
          },
          (error) => {
            console.log('updateCaseStatus Method Error Encountered: ' + error)
          },
          () => {
            console.log('updateCaseStatus success')
          }
        );

      var currentStartDate = new Date().toLocaleDateString();
      var currentEndDate = new Date().toLocaleDateString();

      var lbdate = new Date(this.lbxdate);
      var getUserId = this.UserId == undefined ? environment.DefaultUserId : this.UserId
      var getDateTimeStamp = new Date()
      var systemDateTime = getDateTimeStamp.getHours() + ":" + getDateTimeStamp.getMinutes() + ":" + getDateTimeStamp.getSeconds()

      console.log("Date Time: " + currentStartDate + " " + getDateTimeStamp.getHours() + ":" + getDateTimeStamp.getMinutes() + ":" + getDateTimeStamp.getSeconds())

      // Update AWD Use Id and PS1_Flag
      this.updateBatchUserId(this.lbxid, this.lbxdate, this.lbxbatch, getUserId)

      //Call UpdateTimeAccess to update the batch access table
      this.updateAccessTime("TRUE", this.lbxid, this.lbxdate, this.lbxbatch, getUserId, currentStartDate + " " + systemDateTime, currentEndDate + " " + systemDateTime, "P", "Y")
      // this.returnBack('Completed');   

      var myMessage = new Array<any>()
      myMessage.push('Completed')
      if (document.referrer != null) {
        console.log("Return Back Output: " + myMessage)
        parent.postMessage(myMessage, "*")
      }

      console.log("BB-Proc Batch View: Batch processing finished")
      alert("BB-Proc Batch View: Batch processing finished")

      if (!environment.Development) {
        var dvProcess = parent.document.getElementById("dvProcess")
        //alert("Close Pressed")
        if (dvProcess != undefined) {
          dvProcess.style.display = "none"
        }
        else {
          parent.window.open('', '_self', '');
          parent.window.close();
        }
      }
    }

  }

  UnlockAWDCase(awdCaseId, getUserId) {
    let unlockResult = new Array<any>()
    this.bbservices.UnlockInstance(awdCaseId, getUserId, this.appId)
      .subscribe(
        (data) => {
          unlockResult = data
          unlockResult.forEach(element => {
            console.log("UnlockInstance Result: " + element.Result)
          })

        },
        (error) => console.log('UnlockInstance Method Error Encountered: ' + error),
        () => console.log('UnlockInstance Success')
      );
  }


  UpdateAWDCaseStatus(awdCaseId, AppId, getUserId, AWDComment, AWDStatus) {
    // Update the Case status from CREATED to PROCESSED 
    var retn: string = ''
    var outRes: string = ''

    this.bbservices.updateCaseStatus(awdCaseId, AppId, getUserId, AWDComment, AWDStatus)
      .subscribe(
        (data) => {
          this.ResultData = data
          this.ResultData.forEach(element => {
            outRes = element.Result
          })
          this.statusResult = outRes
          console.log("UpdateCaseStatus API Result: " + this.statusResult)
        },
        (error) => {
          console.log('updateCaseStatus Method Error Encountered: ' + error)
        },
        () => {
          console.log('updateCaseStatus success')
        }
      );
  }

  UpdateAWDCaseStatus1(getUserId, AWDComment, AWDStatus) {
    // Update the Case status from CREATED to PROCESSED 
    var retn: boolean

    this.bbservices.updateCaseStatus(this.AWDObjectId, this.appId, getUserId, AWDComment, AWDStatus)
      .subscribe(
        (data) => {
          var outRes: string
          this.ResultData = data
          this.ResultData.forEach(element => {
            console.log("UpdateCaseStatus Result: " + element.Result)
            outRes = element.Result
            if (!outRes.includes('Code:0')) {
              console.log(outRes)
              retn = false
            }
            else {
              retn = true
            }
          })
        },
        (error) => {
          retn = false
          console.log('updateCaseStatus Method Error Encountered: ' + error)
        },
        () => {
          console.log('updateCaseStatus success')
          retn = true
        }
      );
    return retn
  }

  validateCheckView(): any {

    var foundCtr: number = 0
    var totalAmtPaid: number = 0
    var retn: boolean
    var oldItem: number = 0
    var oldProcAmount = 0

    console.log("validateCheckView");
    oldItem = parseInt(this.CurrentBatchNo) - 1;
    // oldItem = parseInt(this.CurrentBatchNo);
    console.log("oldItem: " + oldItem);
    console.log("initBatchItemNumber:" + this.initBatchItemNumber);

    // if (oldItem >= this.initBatchItemNumber) {
    //   console.log("getProcBatchData");
    //   console.log("oldProcAmount:" + oldProcAmount);
    //   oldProcAmount = this.getProcBatchData[Number(oldItem)].Amount;
    //   console.log("oldProcAmount:" + oldProcAmount);
    // }

    oldProcAmount = this.getProcBatchData[Number(oldItem)].Amount;
    console.log("oldProcAmount:" + oldProcAmount);

    // test
    console.log("batch completed: " + this.batchCompleted);

    if (((Number(this.batchCompleted) == 0 || this.batchCompleted == "")) || (Number(this.TotalAmount) !== Number(this.totalCheckAmount) ) ) {
      console.log("To complete a check, the total amount of PLPs must equal the check total.")
      alert("To complete a check, the total amount of PLPs must equal the check total.")
      retn = false
    }
    else {
          console.log("validateCheckView");
          console.log("getProccessCheck");
          console.log(this.setProccessCheck);

          // this.getProccessCheck.forEach(element => {
          this.setProccessCheck.forEach(element => {
          if (element.AmountPaid > 0) {
            foundCtr++
            // totalAmtPaid +=   Number(element.AmountPaid)
            totalAmtPaid = totalAmtPaid + Number(element.AmountPaid)
          }
      })

      console.log("foundCtr:" + foundCtr);
      //Determine the Payment Type whether Split or Coupon
      if (foundCtr > 1) {
        console.log("totalAmtPaid: " + totalAmtPaid)
        console.log("oldProcAmount: " + oldProcAmount)
        if ((Number(totalAmtPaid) !== Number(oldProcAmount)) && this.takeOutPayment== false) {
          console.log("You cannot have two of the same loans go as PLP.")
          alert("You cannot have two of the same loans go as PLP.")
          retn = false
        }
        else if (Number(totalAmtPaid) == Number(oldProcAmount)) {
          //Coupon
          this.PaymentType = "2"
          retn = true
          console.log("Coupon");
        }
      }
      // else if ((Number(totalAmtPaid) !== Number(oldProcAmount)) && this.takeOutPayment==false) {
      else if ((Number(totalAmtPaid) !== Number(oldProcAmount)) && Number(oldProcAmount!=0 && this.takeOutPayment==false )) {
        console.log("totalAmtPaid:" + totalAmtPaid);
        console.log("oldProcAmount:" + oldProcAmount);
        console.log("To complete a check, the total amount of PLPs must equal the check total.")
        alert("To complete a check, the total amount of PLPs must equal the check total.")
        retn = false
      }
      else {
        //Split
        console.log("PaymentType3");
        this.PaymentType = "3"
        retn = true
      }
    }
    return retn
  }

  cancelCheckView() {
    this.isOpenCheck = false
    this.isCheckView = true
    this.clearObjects()
    this.d.size1 = 80
    this.d.size2 = 20
  }

  clearCheckViewFields() {
    this.getProccessCheck = null
    this.setProccessCheck = null
    this.lastnameSearch = ""
    this.firstnameSearch = ""
    this.ssnSearch = ""
    this.accountSearch = ""
    this.loanSearch = ""
    this.TotalAmount = ""
    this.totalCheckAmount = ""
    this.Difference = ""
    this.currentSSN = ""
    this.currentAccount = ""
    this.currentLoan = ""
  }

  clearObjects() {
    this.imageViewer = ""
    this.getProccessCheck = null
    this.setProccessCheck = null
    this.lastnameSearch = ""
    this.firstnameSearch = ""
    this.ssnSearch = ""
    this.accountSearch = ""
    this.loanSearch = ""
    this.LockboxCV = ""
    this.LockboxDateCV = ""
    this.BatchCV = ""
    this.ItemCV = ""
    this.TotalAmount = ""
    this.totalCheckAmount = ""
    this.Difference = ""
    this.currentSSN = ""
    this.currentAccount = ""
    this.currentLoan = ""
  }

  clearSearch() {
    this.lastnameSearch = ""
    this.firstnameSearch = ""
    this.ssnSearch = ""
    this.accountSearch = ""
    this.loanSearch = ""
  }

  selectBatch(event: any, item: any) {
    var getAWDObjId: any;
    var sourceAWDObjId: string = ""
    var itmBatch
    var getUserId = this.UserId == undefined ? "" : this.UserId

    this.getProcBatchData.forEach(element => {
      if (item.Amount === element.Amount) {
        getAWDObjId = item.AWDObjId
        itmBatch = item.BatchItemNumber
        this.chkAmount = element.Amount
      }
    });

    this.bbservices.findSource(getAWDObjId + "T01", "ALIP", getUserId)
      .subscribe(
        (data) => {
          data.forEach(element => {
            sourceAWDObjId = element.SourceId
          });
          console.log("SourceId: " + sourceAWDObjId)
          console.log(environment.ImageViewerAPI + "=" + sourceAWDObjId)
          this.imageViewer = environment.ImageViewerAPI + "=" + sourceAWDObjId
          this.lbxAmount = item.Amount

          this.LockboxCV = this.lbxid
          this.LockboxDateCV = this.lbxdate
          this.BatchCV = this.lbxbatch
          this.ItemCV = itmBatch
        },
        (error) => alert('FindSource Method Error Encountered: ' + error),
        () => console.log('success')
      );
  }

  rowColors(item) {
    var rgbColor = ''
    if (item.BatchItemNumber == this.rowSelect) {
      rgbColor = 'rgb(255, 255, 197)'
    }
    else {
      rgbColor = 'rgb(255, 255, 255)'
    }
    return rgbColor
  }


  LoadSourceCheckView(item: any) {
    console.log('ImageViewer: ' + environment.ImageViewerAPI + "=" + item)
    this.imageViewer = environment.ImageViewerAPI + "=" + item
  }
  setSelectedEntities($event: any) {
    this.selectedEntities = $event;
    alert(this.selectedEntities);
  }

  disableButton() {
    return this.isOpenCheck
  }

  enabdisCheckView() {
    return this.isCheckView
  }

  enabdisProcessBatch() {
    return this.isProcessBatch
  }

  reloadProcBatchData(params) {
    //this.getProcBatchData.query(params).then(items => this.itemsProcBatch = items);
  }

  rowTooltip(item) { return this.msgTitleToolip }

  //for Number only you can use this as
  onlyNumberKey(event) {
    return this.commonUtility.onlyNumberKey(event)
  }


  onlyDecimalNumberKey(event) {
    return this.commonUtility.onlyDecimalNumberKey(event);
  }

  omit_special_char(event) {
    var k;
    k = (event.which) ? event.which : event.keyCode;  //event.charCode;  //         k = event.keyCode;  (Both can be used)
    return this.commonUtility.omit_special_char(event)
  }

  returnBack(dataResponse) {
    var myMessage = new Array<any>()
    myMessage.push(dataResponse)
    if (document.referrer != null) {
      console.log("Return Back Output: " + myMessage)
      parent.postMessage(myMessage, "*")
    }
  }

  showProBatchView() {
    this.d.size1 = 80
    this.d.size2 = 20
  }

  hideProBatchView() {
    this.d.size1 = 5
    this.d.size2 = 95
  }

}

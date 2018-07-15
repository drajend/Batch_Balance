// IMPORTANT NOTE:
// In Environment.Dev.ts, set the Development to true when debbuging and set back to false before deploying to Dev
// Otherwise the Close, Done, Approve and Deny buttons will not exit/close

import {Component, OnInit,Input, Output, EventEmitter, ViewEncapsulation} from '@angular/core'
import {Http, Response} from '@angular/http'
import {BbapiService} from "../services/bbapi.service"  
import {environment} from "../../environments/environment.qa"
import {IEProcessBatch} from '../model/IProcessBatch'
import {LocalDataSource} from 'ng2-smart-table'
import {ViewCell} from 'ng2-smart-table'
import {ActivatedRoute} from '@angular/router'
import {DatePipe} from '@angular/common';
import {CurrencyPipe} from '@angular/common';
import {AppComponent} from 'app/app.component'
import {CommonUtility} from 'app/utility/common.component'
import { DataTable, DataTableResource } from '../data-table'
import { elementAt } from 'rxjs/operator/elementAt'
import { SplitPaneModule } from 'ng2-split-pane';
import { Button } from 'selenium-webdriver';
import { MockNgModuleResolver } from '@angular/compiler/testing';

@Component({
  selector: 'app-qabatch',
  templateUrl: './qabatch.component.html',
  styleUrls: ['./qabatch.component.css'],
  host: {'style' : 'height: 100%'},
  providers: [BbapiService, CurrencyPipe, CommonUtility]
})

export class QABatchComponent implements OnInit {

  //Declare variables
  getQABatchData
  getProccessCheck
  setProccessCheck:Array<any>=[] 
  getBatchInfoDT
  findSourceData
  getRepayPLPData
  source: LocalDataSource
  sourceCheckView: LocalDataSource
  dataService:any

  lbxid:any
  lbxdate:any
  lbxbatch:any
  itemsbatch:any
  batchCompleted:any
  batchTotal:any
  UpdatedBy
  Approval
  ApprovalBy
  ProcessBatchAmount

  // take out payment
  initItemAmountPaid   //added for defect # 1293
  selfltAmountPaid     //added for defect # 1293

  delLockbxid         // use for take out payment
  delLbxdate          // use for take out payment
  delLbxbatch         // use for take out payment
  delItemCV           // use for take out payment
  
  takeOutPayment:boolean=false;

 // selected Item details
  selSSN  
  selAccount 
  selLoanStat  
  selLoan  

  processStatus:boolean
 
  // selected Item details

    // for JSONFile
    jsFile = {}


  paramLbxID  
  paramLbxdate 
  paramLbxbatch  
  paramItemCV  

  QABatchAmount
  CurrentBatchNo
  sourceAWDObjId
  initBatchItemNumber = 0
  cntr = 0

  LockboxCV
  LockboxDateCV
  BatchCV
  ItemCV
  Difference
  TotalAmount

  lastnameSearch
  firstnameSearch
  ssnSearch
  accountSearch
  loanSearch

  itemsQABatch = [];
  selectedEntities: any[];
  imageViewer:any

  lbxAmount:any
  totalbatchAmount;
  totalCheckAmount;
  
  setClickedRow:Function;
  index;
  indexCheckView
  selectedRow;

  AWDObjectId:any
  BatchInfoObjectId
  UserId
  headerTitleProcBatch
  headerCheckView

  isOpenCheck:boolean
  isCheckView:boolean
  isProcessBatch:boolean
  noChangesCheck:boolean=false;
 

  qabbCount = 0;
  cvCount = 0;
  qabbResource

  insertResult
  deleteResult
  updateResult

  PaymentType=""
  CreateWorkResult
  ReferralResult
  currentSSN
  currentAccount
  currentLoan
  blnFound:boolean

  appId 

  cvResource:any
  chkAmount:any
  LoanItemNumber

  msgTitleToolip:string="To update the Table, press Enter key after input on Amount Paid."

  rowTooltip
  monthName

  widthHorizontal
  widthVertical

  retrieveRet:string=""
  rowSelect

  //Panels settings 
  d = {
    dir: 'vertical',
    gutterSize: 15,
    width: null,
    height: null,
    size1: 85,
    size2: 15
}

  constructor(private commonUtility?: CommonUtility, private currencyPipe?: CurrencyPipe, private bbservices?: BbapiService, private http?: Http, private route?: ActivatedRoute){
    this.rowColors = this.rowColors.bind(this);
  }


  ngOnInit() {        
    //Initialize variables
    this.monthName = {1:"Jan",2:"Feb",3:"Mar",4:"Apr",5:"May",6:"Jun",7:"Jul",8:"Aug",9:"Sep",10:"Oct",11:"Nov",12:"Dec"}
    this.headerTitleProcBatch = "QA Batch"
    this.headerCheckView = ""
    this.index = 0
    this.rowSelect = 0
    this.takeOutPayment = false;

    this.lbxid = this.commonUtility.parseLocation(window.location.search)['lbxid']
    this.lbxdate = this.commonUtility.parseLocation(window.location.search)['lbxdate'];
    this.lbxbatch =  this.commonUtility.parseLocation(window.location.search)['batchId'];
    this.AWDObjectId =  this.commonUtility.parseLocation(window.location.search)['awdobjId'];
    this.UserId  =  this.commonUtility.parseLocation(window.location.search)['UserID'];

    console.log("lbxid: " + this.lbxid)
    console.log("lbxdate: " + this.lbxdate)
    console.log("lbxdate: " + this.lbxdate)
    console.log("lbxbatch: " + this.lbxbatch)
    console.log("AWDObjectId: " + this.AWDObjectId)
    console.log("UserId: " + this.UserId)

    this.indexCheckView = 0;
    this.imageViewer = "";
    this.getQABatchData = new Array<any>();
    this.getProccessCheck = new Array<any>();
    this.setProccessCheck = null;

    this.findSourceData = new Array<any>();
    this.isOpenCheck=false
    this.isCheckView =true
    this.isProcessBatch = false

    this.insertResult= new Array<any>();
    this.deleteResult= new Array<any>();
    this.updateResult= new Array<any>();
    this.getRepayPLPData = new Array<any>()
    this.CreateWorkResult = new Array<any>()

    var batchInfoLbxDate:any;
    var currentStartDate = new Date().toLocaleDateString()
    var currentEndDate = new Date().toLocaleDateString()

    var lbdate = new Date(this.lbxdate);
    var dd = lbdate.getDate();
    var mname = this.monthName[lbdate.getMonth() + 1]; //because January is 0! 
    var yyyy = lbdate.getFullYear();
    batchInfoLbxDate = dd + "-" + mname + "-" + yyyy

    this.GetBatchInfo(this.lbxid, batchInfoLbxDate, this.lbxbatch)
    this.GetBatchPLP()
  }

  GetBatchPLP(){   
    var currentStartDate = new Date().toLocaleDateString()
    var currentEndDate = new Date().toLocaleDateString()
    var batchInfoLbxDate
        
    var lbdate = new Date(this.lbxdate);
    var dd = lbdate.getDate();
    var mname = this.monthName[lbdate.getMonth() + 1]; //because January is 0! 
    var yyyy = lbdate.getFullYear();
    batchInfoLbxDate = dd + "-" + mname + "-" + yyyy
    this.cntr = 0

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

        this.getQABatchData = djson;
        this.qabbResource = new DataTableResource(this.getQABatchData);
        this.qabbResource.count().then(count => this.qabbCount = count);
        
        var totalAmountBatch:number=0
        this.getQABatchData.forEach(element => {
        
        totalAmountBatch += parseFloat(element.LoanPMTAmount)

        // defect 1272
        if (this.cntr == 0) {
              this.initBatchItemNumber = element.BatchItemNumber
              console.log("this.cntr: " + this.initBatchItemNumber);
              this.cntr++
            }

            console.log("object id: "+element.AWDObjId);  
            console.log("Loan PMT Amount: ");
            console.log(element.LoanPMTAmount);

        });

        this.totalbatchAmount = totalAmountBatch.toFixed(2)
        
        console.log("Total Batch Amount: " + this.totalbatchAmount);

      });
      
      console.log("currentStartDate: " + currentStartDate)            // defect 1272
      console.log("currentEndDate: " + currentEndDate)

    }
  }

  GetBatchInfo(lockboxid, lockboxdate, batchid){
    //Invoke the GetBatchInfo service
    var UpdatedBy
    var Approval
    var ApprovalBy
    
    this.bbservices.getBatchInfo(lockboxid, lockboxdate, batchid)
    .subscribe(
      (data)=> {
        this.getBatchInfoDT = data;
        this.getBatchInfoDT.forEach(element => {
            this.itemsbatch = element.PLOItemCount
            // comment out for testing
            this.batchCompleted = element.LoanAmount
            //this.batchCompleted = 0;

            console.log("element.LoanAmount"); 
            console.log(element.LoanAmount);
            
            console.log("GetBatchInfo");
            console.log("Output service Data:" + data );
            console.log("batchCompleted: " + this.batchCompleted)

            // this.batchCompleted = this.batchCompleted.toFixed(2);    not supported

            UpdatedBy = element.UpdateUseId
            Approval = element.ApprovedFlag
            ApprovalBy = element.ApprovedUseId
        });

        this.UpdatedBy = UpdatedBy == "" ? "N/A":UpdatedBy
        if(Approval == "A"){
          this.Approval = "Approved"
          this.ApprovalBy = ApprovalBy
        }
        else if(Approval == "D"){
          this.Approval = "Denied"
          this.ApprovalBy = ApprovalBy
        } 
        else{
          this.Approval = "NO"
          this.ApprovalBy = "N/A"
        }
    },
    (error) => alert('getBatchInfo Method Error Encountered: ' + error)
  );
  }

  Refresh(){

    this.clearQABatchControls()
    var currentStartDate = new Date().toLocaleDateString()
    var currentEndDate = new Date().toLocaleDateString()

    var lbdate = new Date(this.lbxdate);
    var dd = lbdate.getDate();
    var mname = this.monthName[lbdate.getMonth() + 1]; //because January is 0! 
    var yyyy = lbdate.getFullYear();
    var batchInfoLbxDate = dd + "-" + mname + "-" + yyyy

    this.GetBatchInfo(this.lbxid, batchInfoLbxDate, this.lbxbatch)
    this.GetBatchPLP()

  }

  //Invoke when Search button pressed
  getLoanData(){

    //These objects are declared above and defined in HTML thru NgModel
    console.log("getLoanData Invoked")
    this.d.size1 = 5
    this.d.size2 = 95

    var vrssnSearch = this.ssnSearch == undefined ? "" : this.ssnSearch ; 
    var vraccountSearch = this.accountSearch == undefined ? "" : this.accountSearch ; 
    var vrloanSearch =  this.loanSearch == undefined ? "" : this.loanSearch ;  
    var vrfnameSearch = this.firstnameSearch == undefined ? "" : this.firstnameSearch ;  
    var vrlnameSearch = this.lastnameSearch == undefined ? "" : this.lastnameSearch ;   

    this.currentSSN = ""
    this.currentAccount = ""
    this.currentLoan = ""

    var fltLastPayAmt:number=0
    var fltAmountPaid:number=0
    var fltDifference:number=0
    var recomputeTotalPaid:number=0
    var currentLoan:number=0

    this.getProccessCheck = null

    //Invoke the getLoanData service
    this.bbservices.getLoanData(vrssnSearch, vraccountSearch, vrloanSearch, vrfnameSearch, vrlnameSearch )
        .subscribe(
          (data)=> {
            if(data.length > 0){
              this.isCheckView = false
              this.isProcessBatch = true
              //this.sourceCheckView.load(data)
              this.getProccessCheck = data;

              console.log("Get loan data:");
              console.log(data);

              //     // this.setProccessCheck = null;
              // if (this.setProccessCheck == null)
              // {
              //   this.setProccessCheck = this.getProccessCheck ;
              //   console.log("set value");
              // }
              // else
              // {
              //   //this.setProccessCheck.push(this.getProccessCheck);
              //   this.createJsonFile();
              //   console.log("push value");
              // }

              // console.log("after adding values: setProcessCheck:");
              // console.log(this.setProccessCheck);

              // if(this.getProccessCheck[0].Result == undefined){
              // this.cvResource = new DataTableResource(this.getProccessCheck);

              if(this.getProccessCheck[0].Result == undefined){

                this.cvResource = new DataTableResource(this.getProccessCheck);
                this.cvResource.count().then(count => this.cvCount = count);

                console.log("QABatchAmount: " + this.ProcessBatchAmount)

                // this.getProccessCheck.forEach(element => {
                this.getProccessCheck.forEach(element => {
                console.log("getLoanData Loan: " + element.Loan)
                console.log("getLoanData LoanItemNumber: " + this.LoanItemNumber)
                  if(Number(element.Loan) == Number(this.LoanItemNumber)){
                    element.AmountPaid = this.ProcessBatchAmount
                    fltAmountPaid += Number(element.AmountPaid)
                    this.initItemAmountPaid = fltAmountPaid                    
                  }
                });
                
                console.log("fltAmountPaid: " + fltAmountPaid)
                if (this.takeOutPayment= false)
                {
                  fltDifference = this.ProcessBatchAmount - fltAmountPaid
                  this.TotalAmount = fltAmountPaid
                  this.totalCheckAmount = this.ProcessBatchAmount
                  this.Difference = fltDifference
                }
              
              }
              else{
                this.getProccessCheck = null
                this.setProccessCheck = null
                //alert('No rows found that match the search criteria.')
              }
               
              // this.setProccessCheck = null;
              if (this.setProccessCheck == null)
              {
                  this.setProccessCheck = this.getProccessCheck ;
                  console.log("set value");
              }
              else
              {
                  //this.setProccessCheck.push(this.getProccessCheck);
                  this.createJsonFile();
                  console.log("push value");
              }

            }
            else{

                this.getProccessCheck = null
                this.setProccessCheck = null
                //alert('No rows found that match the search criteria.')
            }
        },
        (error) => { 
          if(this.getProccessCheck == undefined || this.setProccessCheck ==undefined){
            //alert('No rows found that match the search criteria.')
          }
          else{
            alert('GetLoanData Method Error Encountered: ' + error)
          }
        }
      );                                                                                                            
    }

  // UpdateLoanAmountInProcessCheck(LoanPMTAmount, Loan){
  //   this.getProccessCheck.forEach(element => {
  //     if(element.Loan == Loan){
  //       console.log('Found: ' + element.Loan)
  //       element.AmountPaid = LoanPMTAmount
  //     }
  //   });
  // }

  UpdateLoanAmountInProcessCheck(LoanPMTAmount, Loan){
    this.getProccessCheck.forEach(element => {
      if(element.Loan == Loan){
        console.log('Found: ' + element.Loan)
        element.AmountPaid = LoanPMTAmount
      }
    });
  }

  openCheck(qaBatchData) {
    var procBB = new Array<any>()
    var getAWDObjId;  
    var getUserId = this.UserId == undefined?environment.DefaultUserId:this.UserId
    
    this.rowSelect = qaBatchData.BatchItem
    

    this.CurrentBatchNo = qaBatchData.BatchItem

    if (Number(this.initBatchItemNumber)>1){
            this.CurrentBatchNo = Number(this.CurrentBatchNo - (this.initBatchItemNumber-1))
            console.log("ItemBatchNumber: ");
            console.log(this.CurrentBatchNo);
     }

    this.QABatchAmount = qaBatchData.LoanPMTAmount
    this.sourceAWDObjId = qaBatchData.AWDObjId
    console.log('BatchItemNumber:' + qaBatchData.BatchItem)
    console.log('QABatchAmount:' + this.QABatchAmount)

    this.setProccessCheck = null;
    this.getProccessCheck = null;
    this.takeOutPayment = false;
 
    this.clearObjects()
    this.clearCheckViewFields()        
    
    console.log('ImageRetrieve:forEach(element => { ' + environment.ImageViewerAPI + "=" + this.sourceAWDObjId)
    this.imageViewer = environment.ImageViewerAPI + "=" + this.sourceAWDObjId + "O01"
    this.lbxAmount = qaBatchData.LoanPMTAmount
    this.ProcessBatchAmount = qaBatchData.LoanPMTAmount
    this.LockboxCV = this.lbxid
    this.LockboxDateCV = this.lbxdate
    this.BatchCV = this.lbxbatch
    this.ItemCV =  qaBatchData.BatchItem 
    this.totalCheckAmount = qaBatchData.LoanPMTAmount
    this.Difference = this.QABatchAmount - this.TotalAmount
    this.isOpenCheck = true
    this.isCheckView = false
    this.accountSearch = qaBatchData.PTPAccountId
    this.totalCheckAmount = qaBatchData.LoanPMTAmount
    this.LoanItemNumber = qaBatchData.LoanNumber      
    this.getLoanData()

  }
  
  Referral(){
    var AppId = environment.AppId
    var getUserId = this.UserId == undefined?"":this.UserId
    var comment = "Loan Referral: "
    var LockedTo = "false"
    var AssignedTo = ""
    var DocumentId = ""
    var createcontext = environment.CreateWorkContext

    //",-,SSN,1261390,,-,POLN,382703029,,-,LOAN,156.48,"
    var fldLOB = ",-,TaxId," + this.currentSSN + ",TIN" +
                ",-,PolicyNumber," + this.currentAccount + ",POLN" +
                ",-,LoanNumber," + this.currentLoan +",LOAN" +
                ",-,LockboxNumber," + this.LockboxCV +",LBOX" +
                ",-,LockboxDate," + this.LockboxDateCV +",LBDT" +
                ",-,ItemCount," + this.ItemCV + ",ITEM"

    console.log("FieldLOB: " + fldLOB)

    var createWorkId = ""
    var ParentComment = ""
    var ChildComment = ""
    if(this.currentSSN != "" && this.currentAccount != "" && this.currentLoan ){
      this.bbservices.CreateWork(AppId, getUserId, comment, LockedTo, AssignedTo, DocumentId, createcontext, fldLOB)
      .subscribe(
        (data) => {
          if(data.length > 0){
            this.ReferralResult = data
            this.ReferralResult.forEach(element =>{ 
              createWorkId = element.Result
              console.log("createWorkId: " + element.Result)
            });

            this.bbservices.CreateRelationship(AppId, getUserId, comment, createWorkId, this.sourceAWDObjId, ParentComment,  ChildComment)
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
          else{
            console.log("Empty result")
          }
        },
        (error) => alert('Referral Method Error Encountered: ' + error),
        () => {
            console.log('Referral Successfully executed')
            alert('Referral Successfully executed. AWD Object Id: ' + createWorkId)
          }
      );
    }
    else{
      alert("You must select a row in the Loan table.")
    }
  }


  rowClick(rowEvent) {
    this.currentSSN = rowEvent.row.item.SSN
    this.currentAccount = rowEvent.row.item.Account
    this.currentLoan = rowEvent.row.item.Loan
  }

  Approve(){
    var lastAWDObjId:string=""
    var resultOutput    
    var AppId = environment.AppId
    var getUserId = this.UserId == undefined?environment.DefaultUserId:this.UserId
    var comment = ""
    var LockedTo = "false"
    var AssignedTo = ""
    var DocumentId = ""
    var createcontext = environment.CreateWorkContext
    var AWDTransId:string=""
    var AWDComment:string="" 
    var AWDStatus:string=""
    var fldLOB:string=""
    var ctr:number=0      
    var currentStartDate = new Date().toLocaleDateString();
    var currentEndDate = new Date().toLocaleDateString();
    var errorRetrieve = false
    var errorQualified = false
    var createWorkId = ""
    var ParentComment = ""
    var ChildComment = ""

    console.log("AppId: " + AppId)
    console.log("getUserId: " + environment.DefaultUserId)

    //Don't let users quality their own work

    //modified for Defect #1293  06/05/2018
    this.getQABatchData.forEach(element => {
      if(this.UserId == element.UpdateUserId){
        errorQualified = true
        console.log("this.UserId " + this.UserId );
        console.log("element.UpdateUserId " + element.UpdateUserId);
      }
    })

    if(errorQualified){
      alert("You may not quality a batch that you have processed.")
    }


    if(this.batchCompleted != this.totalbatchAmount){
      alert("The total of completed PLPs does not match the expected batch total. Please make sure all checks have been processed, and try again.")
      errorQualified = true
    }    
    if(errorQualified === false){
      //Begin Loop
      this.getQABatchData.forEach(element => {
        //getUserId = this.UserId == undefined?environment.DefaultUserId:this.UserId
        ctr++
          //",-,SSN,1261390,,-,POLN,382703029,,-,LOAN,156.48,"
          fldLOB =
                      ",-,LockboxNumber," + this.lbxid + ",LBOX" +
                      ",-,LockboxDate," + this.lbxdate + ",LBDT" +
                      ",-,BatchNumber," + this.lbxbatch + ",BTCH" +
                      ",-,ItemCount," + element.BatchItem + ",ITEM" +
                      ",-,CheckNumber," + element.BatchItem + ",CKNB" +
                      ",-,TaxId," + element.TaxId + ",TIN" +
                      ",-,PolicyNumber," + element.PTPAccountId + ",POLN" +
                      ",-,LoanNumber," + element.LoanNumber +",LOAN" +
                      ",-,MSLoanIndicator," + element.SingleMultiLoanIndicator +",MSLN" +
                      ",-,Status,PROCESSED,STAT" ;
  
                console.log("AppId: " + AppId)
                console.log("getUserId: " + getUserId)
                console.log("comment: " + comment)
                console.log("LockedTo: " + LockedTo)
                console.log("AssignedTo: " + AssignedTo)
                console.log("DocumentId: " + DocumentId)
                console.log("createcontext: " + createcontext)
                console.log("AWDObjId: " + element.AWDObjId)
                console.log("fldLOB: " + fldLOB)
                    
            //Begin If
            if(element.AWDObjId != lastAWDObjId){
              lastAWDObjId = element.AWDObjId
              this.RetrieveAWDObject(element.AWDObjId, environment.AppId, "")
              if(Number(this.retrieveRet) != 0){
                alert("There was an error retrieving the REPAY from AWD. Please note the lockbox, batch and item number (from the counter on the bottom of the screen) and call x2300.")
                if(environment.Development){
                  errorRetrieve = true
                  return
                }
                else{
                  this.closeWindow()
                }
              }
              else{
                //AWDTransId = this.ApproveCreateWork(AppId, getUserId, comment, LockedTo, AssignedTo, DocumentId, createcontext, element.AWDObjId, fldLOB)
                this.bbservices.CreateWork(AppId, getUserId, comment, LockedTo, AssignedTo, DocumentId, createcontext, fldLOB)
                .subscribe(
                  (data) => {
                    if(data.length > 0){
                      this.ReferralResult = data
                      this.ReferralResult.forEach(element =>{ 
                        createWorkId = element.Result
                        console.log("createWorkId: " + element.Result)
                      });
                      if(createWorkId != ""){
                        this.bbservices.CreateRelationship(AppId, getUserId, comment, createWorkId, element.AWDObjId + "O01", ParentComment,  ChildComment)
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
                      else{
                        console.log("CreateWork is Null")
                      }
                    }
                    else{
                      console.log("Empty result")
                    }
                  },
                  (error) => alert('CreateWork Method Error Encountered: ' + error),
                  () => {
                      console.log('CreateWork Successfully executed')
                      console.log('CreateWork Successfully executed. AWD Object Id: ' + createWorkId)
                    }
                );              
                //end of If
  
                console.log("ApproveCreateWork AWDTransId: " + createWorkId)
                console.log("UpdateAWDObject4PLP PTPAccountId: " + element.PTPAccountId)
                console.log("UpdateAWDObject4PLP LoanNumber: " + element.LoanNumber)
                console.log("UpdateAWDObject4PLP SingleMultiLoanIndicator: " + element.SingleMultiLoanIndicator)
                console.log("UpdateAWDObject4PLP BatchItem: " + element.BatchItem)
  
                this.bbservices.UpdateAWDObject4PLP(
                          this.lbxid, 
                          this.lbxdate, 
                          this.lbxbatch,
                          element.PTPAccountId,
                          element.LoanNumber, 
                          element.SingleMultiLoanIndicator, 
                          element.BatchItem, 
                          createWorkId)
                    .subscribe(
                      (data)=> {
                        resultOutput = data;
                        console.log("UpdateAWDObject4PLP successfully")
                    },
                    (error) => console.log('UpdateAWDObject4PLP Method Error Encountered: ' + error),
                    () => {
                      console.log('UpdateAWDObject4PLP Successfully executed')}
                );
              }
            }      
            // Check the Create Work Object Id
            if(createWorkId != ""){
              this.bbservices.UpdateObjectFields(createWorkId,AppId,getUserId,element.Comment,fldLOB)
                .subscribe(
                  (data)=> {
                    resultOutput = data[0].Result;
                    console.log("UpdateObjectFields successfully. " + resultOutput)
                },
                (error) => console.log('UpdateObjectFields Method Error Encountered: ' + error),
                () => {
                console.log('UpdateObjectFields Successfully executed')}
              );
    
              this.bbservices.UnlockAWDCase(AWDTransId, getUserId, AppId)
            }
  
            if(element.PTPAccountId == 2802596){
                AWDTransId = this.ApproveCreateWork(AppId, getUserId, comment, LockedTo, AssignedTo, DocumentId, createcontext, element.AWDObjI, fldLOB)
            }          
            
            this.bbservices.UpdateVSYS4PLP(
                  this.lbxid, 
                  this.lbxdate, 
                  this.lbxbatch,
                  element.PTPAccountId, 
                  element.LoanNumber, 
                  element.SingleMultiLoanIndicator, 
                  element.BatchItem, 
                  ctr)
              .subscribe(
                (data)=> {
                  resultOutput = data;
              },
              (error) => console.log('UpdateVSYS4PLP Method Error Encountered: ' + error),
              () => {
                console.log('UpdateVSYS4PLP Successfully executed')
              }
            );
          })
          //End of Loop
  
          if(!errorRetrieve){
            if(!this.AWDObjectId.includes("C01")){
              this.AWDObjectId = this.AWDObjectId  + "C01"
            }
            AWDStatus = "PASSED"
            var ResultData
            this.bbservices.updateCaseStatus(this.AWDObjectId, environment.AppId, getUserId, AWDComment, AWDStatus)
            .subscribe(
              (data) => {
                ResultData = data[0].Result
                console.log('updateCaseStatus ResultData: ' + data[0].Result)
              },
              (error) => {
                console.log('updateCaseStatus Method Error Encountered: ' + error)
              },
              () => {
                console.log('updateCaseStatus success')
              }
            );
            
            
            this.bbservices.UpdateBatch4ApprovedUser(this.lbxid,this.lbxdate,this.lbxbatch,getUserId)
      
            //Call UpdateTimeAccess to update the batch access table
            var lbdate = new Date(this.lbxdate);            
            var getUserId = this.UserId == undefined?environment.DefaultUserId:this.UserId
            var getDateTimeStamp = new Date()
            var systemDateTime = getDateTimeStamp.getHours() + ":" + getDateTimeStamp.getMinutes() + ":" +  getDateTimeStamp.getSeconds()
        
            this.updateAccessTime("TRUE", this.lbxid, this.lbxdate, this.lbxbatch, getUserId, currentStartDate + " " + systemDateTime ,currentEndDate + " " + systemDateTime,"Q","Y")    
            
            var myMessage = new Array<any>()
            myMessage.push('Completed')
            if(document.referrer != null){
              console.log("Return Back Output: " + myMessage)
              parent.postMessage(myMessage,"*")
            }
      
            console.log("Batch approved successfully.")
            alert("Batch approved successfully.")
            if(!environment.Development){
             this.closeWindow()
            }
          }   
        else{
          if(!environment.Development){
            this.closeWindow()
          }   
        }
    }
  }

  ApproveCreateWork(AppId, getUserId, comment, LockedTo, AssignedTo, DocumentId, createcontext, sourceId, fldLOB):any{
    var createWorkId:string=""    
    var createworkResult:Array<any>
    var createWorkId = ""
    var ParentComment = ""
    var ChildComment = ""
    var crResult
    console.log("ApproveCreateWork Invoked")
    this.bbservices.CreateWork(AppId, getUserId, comment, LockedTo, AssignedTo, DocumentId, createcontext, fldLOB)
    .subscribe(
      (data) => {
        createworkResult = data
        createworkResult.forEach(element =>{ 
          createWorkId = element.Result
          console.log("CreateWork Id: " + element.Result)
        });
      },
      (error) => alert('ApproveCreateWork Method Error Encountered: ' + error),
      () => {
          console.log('ApproveCreateWork Successfully executed')
        }
    );    

    if(createworkResult == null){
      console.log("ApproveCreateWork: Found Null ")
    }

    if(createWorkId != ""){
      this.bbservices.CreateRelationship(AppId, getUserId, comment, createWorkId, sourceId + "O01", ParentComment,  ChildComment)
        .subscribe(
          (data) => {
              crResult = data
              crResult.forEach(element =>{ 
                console.log("CreateRelationship Successfully executed. " + element.Result)
              });
             },
          (error) => console.log('CreateRelationship Method Error Encountered: ' + error),
          () => {console.log('CreateRelationship Successfully executed')
          }
        ); 
    }
    else{
      console.log('ApproveCreateWork: No CreateWorkId Generated')
    }
    return createWorkId
  }

  RetrieveAWDObject(AWDObjId, AppId, UserId){
    this.bbservices.GetObjectData(AWDObjId, AppId, UserId)
      .subscribe(
        (data)=> {
          this.retrieveRet = data[0].Result;
          console.log("RetrieveAWDObject ResultOutput: " + this.retrieveRet)
      },
      (error) => console.log('RetrieveAWDObject Method Error Encountered: ' + error),
      () => {console.log('RetrieveAWDObject Successfully executed')}
    );
  }

  Deny(){
    var AWDStatus = "FAILED"
    var AWDComment = "Batch Denied:"
    var getUserId = this.UserId == undefined?environment.DefaultUserId:this.UserId
    var currentStartDate = new Date().toLocaleDateString()
    var currentEndDate = new Date().toLocaleDateString()
 
    var lbdate = new Date(this.lbxdate);            
    var getDateTimeStamp = new Date()
    var systemDateTime = getDateTimeStamp.getHours() + ":" + getDateTimeStamp.getMinutes() + ":" +  getDateTimeStamp.getSeconds()
    
    this.bbservices.UpdateAWDCaseStatus(this.AWDObjectId, environment.AppId, getUserId, AWDComment, AWDStatus)   
    this.bbservices.UpdateBatch4DeniedUser(this.lbxid,this.lbxdate,this.lbxbatch,getUserId)    
      .subscribe(
        (data)=> {
          this.retrieveRet = data[0].Result;
          console.log("UpdateBatch4DeniedUser ResultOutput: " + this.retrieveRet)
      },
      (error) => console.log('UpdateBatch4DeniedUser Method Error Encountered: ' + error),
      () => {console.log('UpdateBatch4DeniedUser Successfully executed')}
    );

    this.updateAccessTime("FALSE",this.lbxdate,this.lbxid,this.lbxbatch,getUserId,currentStartDate,currentEndDate,"Q","N")
    
    alert("Batch denied")
    if(!environment.Development){
      this.closeWindow()
    }
  }

  CloseForm(){    
    var getUserId = this.UserId == undefined?environment.DefaultUserId:this.UserId
    var currentStartDate = new Date().toLocaleDateString()
    var currentEndDate = new Date().toLocaleDateString()
 
    var lbdate = new Date(this.lbxdate);            
    var getUserId = this.UserId == undefined?environment.DefaultUserId:this.UserId
    var getDateTimeStamp = new Date()
    var systemDateTime = getDateTimeStamp.getHours() + ":" + getDateTimeStamp.getMinutes() + ":" +  getDateTimeStamp.getSeconds()
    
    this.updateAccessTime("FALSE",this.lbxdate,this.lbxid,this.lbxbatch,getUserId,currentStartDate,currentEndDate,"Q","N")    
    
    if(!environment.Development){
      this.closeWindow()
    }
  }
    //Invoke UpdateTimeAccess service
  updateAccessTime(NewFlag, LockboxId, LockboxDate, BatchId, UpdateUserId, StartDate, EndDate, AccessType, Processed)
  {
    this.bbservices.updateAccessTime(NewFlag, LockboxId, LockboxDate, BatchId, UpdateUserId, StartDate, EndDate, AccessType, Processed)
    .subscribe(
      (data)=> {},
      (error) => console.log('UpdateAccessTime Method Error Encountered: ' + error),
      () => {console.log('updateAccessTime Successfully executed')}
    );   
  }

  updateCheckItem(event: any, item: any) {
    var fltLastPayAmt:number=0
    var fltAmountPaid:number=0
    var fltDifference:number=0
    var batchCompletedTotalAmount:number=0

    // var initItemAmountPaid:number=0
    // console.log('AmountPaid: ' + item.AmountPaid)
    // console.log('Loan: ' + item.Loan)
    //initItemAmountPaid = item.AmountPaid;
    
    if(parseFloat(item.AmountPaid) < 0){
      alert('You cannot have a PLP for a negative amount.')
    }
    else{
        if(event.which === 13) {
 
          // let updateItem = this.getProccessCheck.find(x => x.PayoffAmt === item.AmountPaid)
          // console.log("Update Item: "+updateItem);
         
          console.log("this.QABatchAmount");
          console.log(this.QABatchAmount);
          console.log("item.AmountPaid");
          console.log(item.AmountPaid);

          if ((this.QABatchAmount > 0) && (item.AmountPaid == 0))
          {
                  this.takeOutPayment = true;
                  this.delLockbxid = this.lbxid ;
                  this.delLbxbatch =  this.lbxbatch; 
                  this.delLbxdate = this.lbxdate;
                  this.delItemCV  = this.ItemCV;           
                  console.log("Take out payment!");
                  console.log("this.delLockbxid" + this.delLockbxid); 
                  console.log("this.delLbxbatch"+this.delLbxbatch); 
                  console.log("this.delLbxdate"+this.delLbxdate); 
                  console.log("this.delItemCV"+this.delItemCV);
          } 
 
        var ctr:number=0;
        var itemNo:number=0;
        this.setProccessCheck.forEach(element => {
             if (element.SSN == item.SSN && element.Account == item.Account && element.Loan == item.Loan ){
                element.AmountPaid = item.AmountPaid
                console.log("Amount Paid: " + element.AmountPaid)
                itemNo=ctr;
             }
             ctr++;
          });
 
          console.log("PLPTotal after take out:");
          this.setProccessCheck[itemNo].AmountPaid = item.AmountPaid;
          console.log(this.setProccessCheck[itemNo].AmountPaid);
          // added validation                       
          //modified for Defect #1293  06/05/2018   
          this.selfltAmountPaid = item.AmountPaid
          this.computeTotalAmountCheck()
          //this.batchCompleted = batchCompletedTotalAmount

        }
    }
  }

  computeTotalAmountCheck(){
    var fltAmountPaid:number=0
    var fltDifference:number=0

    this.setProccessCheck.forEach(element => {
      
      fltAmountPaid += Number(element.AmountPaid)
       console.log("fltAmountPaid: " + element.AmountPaid)
    });

    console.log("this.setProccessCheck");
    console.log(this.setProccessCheck);

    // console.log("Total Amount Paid: " + fltAmountPaid)
    fltDifference = this.ProcessBatchAmount - fltAmountPaid
    this.TotalAmount = fltAmountPaid
    this.totalCheckAmount = this.ProcessBatchAmount
    this.Difference = fltDifference

  }

  // computeTotalAmountCheck(){
  //   var fltAmountPaid:number=0
  //   var fltDifference:number=0

  //   this.getProccessCheck.forEach(element => {
  //     fltAmountPaid += Number(element.AmountPaid)
  //      console.log("fltAmountPaid: " + element.AmountPaid)
  //   });
  //   // console.log("Total Amount Paid: " + fltAmountPaid)
  //   fltDifference = this.ProcessBatchAmount - fltAmountPaid
  //   this.TotalAmount = fltAmountPaid
  //   this.totalCheckAmount = this.ProcessBatchAmount
  //   this.Difference = fltDifference
  // }

  saveCheckDetail(){
    var amtPaid: any
    var failedInsert: boolean=false
    var failedDelete: boolean=false
 
    // comment out for testing
    if (this.takeOutPayment == true)
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
    console.log("lockbxid: " + this.paramLbxID )
    console.log("lbxdate: " + this.paramLbxdate) 
    console.log("lbxbatch: " +  this.paramLbxbatch)
    console.log("ItemCV: " + this.paramItemCV)    

    // this.bbservices.deleteOldPLP(this.lbxid, this.lbxdate, this.lbxbatch, this.ItemCV )
    this.bbservices.deleteOldPLP(this.paramLbxID, this.paramLbxdate,this.paramLbxbatch, this.paramItemCV)
    .subscribe(
      (data)=> {
        this.deleteResult = data
        console.log("Delete Result: " + this.deleteResult[0].Result)
      },
    (error) => {
      failedDelete = true
      alert('deleteOldPLP Method Error Encountered: ' + error)},
      () => {console.log('deleteOldPLP Successfully executed')});

    if(!failedDelete){    
      //Invoke the InsertPLP service
      var findZero = this.PaymentType.substr(1,1)
      var getUserId = this.UserId == undefined?environment.DefaultUserId:this.UserId
      var loanNumber

      if(findZero == "0"){
        loanNumber = this.PaymentType.replace("0","")
      }
      else{
        loanNumber = this.PaymentType
      }

      // this.getProccessCheck.forEach(element => 
      this.setProccessCheck.forEach(element => 
        {         
            console.log("element amount paid");
            console.log(Number(element.AmountPaid));

            // comment out for testing
            console.log("InsertPLP: ");
            console.log(element.Account); 
            console.log("Element Loan: ");
            console.log(element.Loan); 
            console.log("LockboxCV: ");
            console.log(this.LockboxCV); 
            console.log("lbxdate");
            console.log(this.lbxdate); 
            console.log("BatchCV");
            console.log(this.BatchCV);
            console.log("lbxid");
            console.log(this.lbxid);
            console.log("ItemCV");
            console.log(this.ItemCV);
            console.log("this.sourceAWDObjId");             
            console.log(this.sourceAWDObjId.replace("O01","")); 
            console.log("element.AmountPaid");
            console.log(Number(element.AmountPaid));
            console.log("this.PaymentType");
            console.log(this.PaymentType);
            console.log("getUserId"); 
            console.log(getUserId);
            console.log("loanNumber");
            console.log(loanNumber);               
               
          if(Number(element.AmountPaid > 0)){
            amtPaid += parseFloat(element.AmountPaid)
            console.log("---InsertPLP---")
            console.log("Account: " + element.Account)
            console.log("Loan: " + element.Loan)
            console.log("LockboxCV: " + this.LockboxCV )
            console.log("LockboxDateCV: " + this.lbxdate )
            console.log("LockboxCV: " + this.BatchCV) 
            console.log("lockbxid: " +  this.lbxid )
            console.log("ItemCV: " + this.ItemCV)
            console.log("sourceAWDObjId: " + this.sourceAWDObjId.replace("O01",""))
            console.log("AmountPaid: " + element.AmountPaid)
            console.log("LoanStat: " + element.LoanStat)
            console.log("PaymentType: " + this.PaymentType)
            console.log("LoanNumber: " + loanNumber)
            console.log("UserId: " + getUserId)
            console.log("------------------------------")

            this.bbservices.InsertPLP(element.Account, element.Loan, this.LockboxCV, this.lbxdate,
              this.BatchCV, this.lbxid, this.ItemCV, this.sourceAWDObjId.replace("O01",""), Number(element.AmountPaid), this.PaymentType, getUserId, "", loanNumber )
              .subscribe(
                (data)=> {
                  this.insertResult = data
                  console.log("InsertPLP Result: " + this.insertResult[0].Result)
                },
              (error) => {
                  failedInsert = true
                  alert('InsertPLP Method Error Encountered: ' + error)
                },
                () => {console.log('InsertPLP Successfully executed')}
            );

           }

        });
    }

    if(!failedInsert){
      //Invoke the UpdateRepay service
      this.bbservices.UpdateRepay(getUserId,"","","",this.LockboxCV,this.LockboxDateCV,this.BatchCV,this.ItemCV)
      .subscribe(
        (data)=> {
          this.updateResult = data
          console.log("UpdateRepay Result: " + this.updateResult[0].Result)},
          (error) => alert('UpdateRepay Method Error Encountered: ' + error),
          () => {console.log('UpdateRepay Successfully executed')}
      );
    }

  }

  getMinItemNumber(){
    var minItemNumber:any = 0
    var ctr:number =0
    var out:Array<any> =[]  

    this.getQABatchData.forEach(element => {
          if (minItemNumber == 0)
          {
            minItemNumber = element.BatchItem;
          }
          if (element.BatchItem < minItemNumber && minItemNumber !== 0)
          {
            minItemNumber = element.BatchNumber;
          }  
      })
    return minItemNumber  
   }

  // getMinMax(array, type) {
  //   var out = [];
  //   array.forEach(function(el) { return out.push.apply(out, el[type]); }, []);
  //   return { min: Math.min.apply(null, out), max: Math.max.apply(null, out) };
  // }
   
  validateCheckView():any{

    var minValItemNo: any;
    var oldItem = parseInt(this.CurrentBatchNo)-1; 
    var oldProcAmount: number =0;

    console.log("Old Item: " + oldItem);
    console.log("getQABatchData");
    console.log(this.getQABatchData);

    minValItemNo = this.getMinItemNumber();
    
    console.log("minValItemNo:");
    console.log(minValItemNo);

    // console.log(this.getMinMax(this.getQABatchData,'value'));

    if (Number(oldItem) >= Number(minValItemNo))
    {
        oldProcAmount = this.getQABatchData[Number(oldItem)].LoanPMTAmount
        console.log(oldProcAmount);
    }
     
    var foundCtr:number=0
    var totalAmtPaid:number=0
    var retn:boolean
    
    this.getBatchInfoDT.forEach(element => {
        this.batchCompleted = element.LoanAmount
    });
    
    // this.setProccessCheck.forEach(element => {
    // })

    console.log("Batch Compeleted: ");
    console.log(this.batchCompleted);
    
    if((Number(this.batchCompleted) == 0 || this.batchCompleted == "" )){
      console.log("The total of the completed PLPs does not match the expected batch total.")
      alert("The total of the completed PLPs does not match the expected batch total.")
      retn = false
    }
    else{
      // this.getProccessCheck.forEach(element => {
        this.setProccessCheck.forEach(element => {
        if(element.AmountPaid > 0){
          foundCtr ++
          totalAmtPaid += Number(element.AmountPaid)
          console.log("First Validation Check:");
          console.log();
        }
      })

      if(foundCtr>1){
        if(Number(totalAmtPaid) !== Number(oldProcAmount) && (Number(oldProcAmount) !=0) && this.takeOutPayment==false ){
          console.log("You cannot have two of the same loans go as PLP.")
          alert("You cannot have two of the same loans go as PLP.")
          retn =  false
        }
        else if(totalAmtPaid == oldProcAmount){
          this.PaymentType = "2"
          retn =  true
        }
      }
       else if(totalAmtPaid != this.totalCheckAmount){
        // else if(totalAmtPaid != oldProcAmount){
       
        console.log("To complete a check, the total amount of PLPs must equal the check total.")
        alert("To complete a check, the total amount of PLPs must equal the check total.")
        retn = false
        //retn = true
      }
      else{
        this.PaymentType = "3"
        retn =  true
      }
    }
    return retn
  }

  doneCheckView(){    
    if (this.takeOutPayment ==true && this.selfltAmountPaid == 0)
    {
     alert("You have taken out a payment from an account. Please make sure to enter the correct check amount!");
     return
    }
      //modified for Defect #1293  06/04/2018
    if ((Number(this.selfltAmountPaid) == Number(this.initItemAmountPaid) && this.takeOutPayment ==false)  || this.selfltAmountPaid == undefined)
    {
        this.noChangesCheck = true;
        console.log("this.selfltAmountPaid: "+ this.selfltAmountPaid);
        console.log("NO CHANGES");
    }  

    var rtnRes = this.validateCheckView()    
    console.log("Return: " + rtnRes)

    if(rtnRes){
      //=====  Save Process Check View
      // this.saveCheckDetail()
      if (this.noChangesCheck == false)
      {
          //Save Process Check View
          console.log("sAve")
          this.saveCheckDetail()                  
      }

      this.isOpenCheck = false // enable the button on Done and Close Process Batch Balance
      this.isCheckView = true  // hide the Check View detail after done 
      
      //Clear Check View Fields
      this.clearObjects()
      this.d.size1 = 80
      this.d.size2 = 20
    }    
  }

  nextBatch(){
    var AWDSourceId
    var rtnRes 
    var nextItem = 0
    var getUserId = this.UserId == undefined?environment.DefaultUserId:this.UserId

    console.log("this.selfltAmountPaid");
    console.log(this.selfltAmountPaid);
    console.log("initItemAmountPaid");
    console.log(this.initItemAmountPaid);
 
    //  if (this.takeOutPayment ==true && this.selfltAmountPaid == 0)
    //  {
    //   console.log("To complete a check, the total amount of PLPs must equal the check total.")
    //   alert("To complete a check, the total amount of PLPs must equal the check total.")
    //   rtnRes = false;
    //   return
    //  }

       //modified for Defect #1293  06/04/2018
     if ((Number(this.selfltAmountPaid) == Number(this.initItemAmountPaid) && this.takeOutPayment ==false)  || this.selfltAmountPaid == undefined)
     {
         this.noChangesCheck = true;
         console.log("this.selfltAmountPaid: "+ this.selfltAmountPaid);
         console.log("NO CHANGES");
     }  

    rtnRes = this.validateCheckView()
    
    if(!rtnRes){
        console.log("return");
        return
    }
    else{
        nextItem = parseInt(this.CurrentBatchNo) + 1 
        this.rowSelect = nextItem
        AWDSourceId = this.getCurrentBatch(nextItem)

        console.log("nextItem: " + nextItem)
        console.log("AWDSourceId: " + AWDSourceId)

        if(AWDSourceId != "" || AWDSourceId != undefined)
        {
          
          //  original code
          //  Save Process Check View
          //  this.saveCheckDetail() 
          //  save only when there is changes           
          //  modified for Defect #1293  06/05/2018

          if (this.noChangesCheck == false)
          {
            //Save Process Check View
            this.saveCheckDetail()                  
          }
          
          //Clear Check View Fields
          this.clearCheckViewFields()          
          console.log("clearCheckViewFields Successful ")    
          console.log("CurrentBatchNo: " + this.CurrentBatchNo)
          
          var resRet = this.nextProcessBatch(nextItem, getUserId, AWDSourceId)

          if(resRet){
            console.log("nextBatch");
            this.accountSearch = this.getAccountId(nextItem)
            this.ProcessBatchAmount = this.getPayAmount(nextItem)
            this.LoanItemNumber = this.getLoanNumber(nextItem)
            this.getLoanData()
          }
          else{
            this.d.size1 = 80
            this.d.size2 = 20
          }
        }
        else{
            console.log("AWDSourceId EOD")
            this.isOpenCheck = false // enable the button on Done and Close Process Batch Balance
            this.isCheckView = true  // hide the Check View detail after done 

            //Clear Check View Fields
            this.clearObjects()   
            this.d.size1 = 80
            this.d.size2 = 20
        }     
    }
  }
  
  nextProcessBatch(nextItem, getUserId, AWDSourceId):any{
    var retRes = true
    nextItem = parseInt(this.CurrentBatchNo) + 1 
    var NextSourceId = this.getCurrentBatch(nextItem)
    if(NextSourceId == ""){    
      console.log("NextSourceId EOD")
      this.isOpenCheck = false // enable the button on Done and Close Process Batch Balance
      this.isCheckView = true  // hide the Check View detail after done 
      this.clearObjects() 
      retRes = false
    }        
    else{
      this.imageViewer = ""
      this.sourceAWDObjId = AWDSourceId
      console.log('ImageRetrieve: ' + environment.ImageViewerAPI + "=" + AWDSourceId + 'O01')
      this.imageViewer = environment.ImageViewerAPI + "=" + AWDSourceId + 'O01'
      //this.lbxAmount = AWDSourceId.Amount
  
      this.LockboxCV = this.lbxid
      this.LockboxDateCV = this.lbxdate
      this.BatchCV = this.lbxbatch
      this.ItemCV = nextItem
      this.CurrentBatchNo = nextItem
  
      this.ProcessBatchAmount = this.getQABatchData[Number(this.ItemCV)-1].Amount
      this.totalCheckAmount = this.ProcessBatchAmount
      //this.Difference = this.ProcessBatchAmount - this.TotalAmount
      this.isOpenCheck = true
    }
    return retRes
  }

  createJsonFile()
  {

    console.log("before push:" )
    console.log(this.setProccessCheck); 

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
      
           this.setProccessCheck.push(this.jsFile);
          
    }) 

    console.log("after push:" )
    console.log(this.setProccessCheck); 

    console.log("json string");
    console.log(JSON.stringify(this.jsFile));
  }


  getCurrentBatch(nextItem):any{
    var locSourceId:string=""
    this.getQABatchData.forEach(element => {
      if(element.BatchItem === nextItem.toString()){
        console.log('getCurrentBatch AWDObjId: ' + element.AWDObjId)
        locSourceId = element.AWDObjId
      }
    });

    console.log('locSourceId: ' + locSourceId)
    return locSourceId
  }

  getAccountId(nextItem):any{
    var locAccountId:string=""
    this.getQABatchData.forEach(element => {
      if(element.BatchItem === nextItem.toString()){
        locAccountId = element.PTPAccountId
      }
    });
    console.log('locAccountId: ' + locAccountId)
    return locAccountId
  }

  getPayAmount(nextItem):any{
    var locPayAmount
    this.getQABatchData.forEach(element => {
      if(element.BatchItem === nextItem.toString()){
        locPayAmount = element.LoanPMTAmount
      }
    });
    console.log('locPayAmount: ' + locPayAmount)
    return locPayAmount
  }

  getQABatchItem(nextItem):any{
    var locBatchItem
    this.getQABatchData.forEach(element => {
      if(element.BatchItem === nextItem.toString()){
        locBatchItem = element.BatchItem
      }
    });
    console.log('locPayAmount: ' + locBatchItem)
    return locBatchItem
  }


  getLoanNumber(nextItem):any{
    var locLoanNumber
    this.getQABatchData.forEach(element => {
      if(element.BatchItem === nextItem.toString()){
        locLoanNumber = element.LoanNumber
      }
    });
    console.log('locLoanNumber: ' + locLoanNumber)
    return locLoanNumber
  }
  
  selectBatch(event: any, item: any){
    var getAWDObjId:any
    var sourceAWDObjId:string=""
    var itmBatch

    this.getQABatchData.forEach(element => {
      if(item.Amount === element.Amount){
        getAWDObjId = item.AWDObjId
        itmBatch = item.BatchItem
        this.chkAmount = element.LoanPMTAmount
      } 
    });

  }

  reloadQABatchData(params) {
    //this.getQABatchData.query(params).then(items => this.itemsQABatch = items);
  }

  cancelCheckView(){
    this.isOpenCheck = false
    this.isCheckView = true
    this.clearObjects()
    this.d.size1 = 80
    this.d.size2 = 20
  }

  clearCheckViewFields(){
    this.getProccessCheck = null
    this.setProccessCheck = null
    this.lastnameSearch = ""
    this.firstnameSearch = ""
    this.ssnSearch = ""
    this.accountSearch = ""
    this.loanSearch = ""      
    this.TotalAmount = ""
    this.totalCheckAmount = ""
    this.Difference =  ""
    this.currentSSN = ""
    this.currentAccount = ""
    this.currentLoan = ""
  }

  clearObjects(){
    this.imageViewer = ""
    this.getProccessCheck = null
    this.setProccessCheck = null
    this.lastnameSearch = ""
    this.firstnameSearch = ""
    this.ssnSearch = ""
    this.accountSearch = ""
    this.loanSearch = ""
    this.LockboxCV =  ""
    this.LockboxDateCV =  ""
    this.BatchCV =  ""
    this.ItemCV =  ""       
    this.TotalAmount = ""
    this.totalCheckAmount = ""
    this.Difference =  ""
    this.currentSSN = ""
    this.currentAccount = ""
    this.currentLoan = ""
  }

  clearQABatchControls(){
    this.getQABatchData = null    
    this.itemsbatch = ""
    this.UpdatedBy = ""
    this.Approval = ""
    this.ApprovalBy = ""
    this.batchCompleted = ""
    this.totalbatchAmount = ""
  }

  clearSearch(){
    this.lastnameSearch = ""
    this.firstnameSearch = ""
    this.ssnSearch = ""
    this.accountSearch = ""
    this.loanSearch = ""
  }

  closeWindow(){  
    parent.window.open('', '_self', ''); parent.window.close();
  }
  
  showQABatchView(){
    this.d.size1 = 60
    this.d.size2 = 40
  }

  hideQABatchView(){
    this.d.size1 = 5
    this.d.size2 = 95
  }

  rowColors(item) {
    var rgbColor=''
    if (item.BatchItem == this.rowSelect){
      rgbColor = 'rgb(255, 255, 197)'
    } 
    else{
      rgbColor = 'rgb(255, 255, 255)'
    }
    return rgbColor
  }

  disableButton(){
    return this.isOpenCheck
  }

  enabdisCheckView(){
    return this.isCheckView
  }

  enabdisProcessBatch(){
    return this.isProcessBatch
  }

  onlyNumberKey(event) {
    return this.commonUtility.onlyNumberKey(event)
  }

  onlyDecimalNumberKey(event) {
    return this.commonUtility.onlyDecimalNumberKey(event);
    }
  
  omit_special_char(event)
  {   
     var k;  
     k = (event.which) ? event.which : event.keyCode;  //event.charCode;  //         k = event.keyCode;  (Both can be used)
     return this.commonUtility.omit_special_char(event) 
  }
}

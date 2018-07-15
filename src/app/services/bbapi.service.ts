import {Injectable } from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {IEProcessBatch} from '../model/IProcessBatch';
import {IELoadData} from '../model/ILoadData';
import {IEBatchInfo} from '../model/IBatchInfo';
import {IEResult} from '../model/IResult';
import {environment } from "../../environments/environment.dev"
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class BbapiService {

  constructor(private http: Http) { }

  getRepayPLPs(lbxid, lbxdate, batchid, itemnumber){
    let url = environment.GetRepayPLP + '?lbxid=' + lbxid + '&lbxdate=' + lbxdate + '&batchId=' + batchid + '&itemnumber=' + itemnumber
    return this.http.get(url)
      .map((response:Response) => <IEProcessBatch[]>response.json())
      .catch(this.handleError);   
  }
  
  getProcessFlag(lbxid, lbxdate, batchid, itemnumber){
    let url = environment.GetProcessFlag + '?lbxid=' + lbxid + '&lbxdate=' + lbxdate + '&batchId=' + batchid + '&itemnumber=' + itemnumber
    return this.http.get(url)
      .map((response:Response) => <IEProcessBatch[]>response.json())
      .catch(this.handleError);
  }

  getProcBatchGrid(lbxid, lbxdate, batchid):Observable<IEProcessBatch[]>{
    let url = environment.GetProcBatchGridAPI + '?id=' + lbxid + '&lbxdate=' + lbxdate + '&batchId=' + batchid
    return this.http.get(url)
      .map((response:Response) => <IEProcessBatch[]>response.json())
      .catch(this.handleError);
  }

  getLoanData(ssnSearch, accountSearch, loanSearch, fnameSearch:string, lnameSearch:string):Observable<IELoadData[]>{
    let url = environment.GetLoanData + '?ssn=' + ssnSearch + '&acct=' + accountSearch + 
        '&loan=' + loanSearch + '&fname=' + fnameSearch.toUpperCase() + '&lname=' + lnameSearch.toUpperCase()
    return this.http.get(url)
      .map((response:Response) => <IELoadData[]>response.json())
      .catch(this.handleError);
  }

  getBatchInfo(lockboxid, lockboxdate, batchid){
    let url = environment.GetBatchInfo + '?id=' + lockboxid + '&lbxdate=' + lockboxdate + 
        '&batchid=' + batchid 
    console.log(url)
    return this.http.get(url)
      .map((response:Response) => response.json())
      .catch(this.handleError);
  }

  updateBatchUserId(LockboxId, LockboxDate, BatchId, UpdateUserId){
    let url = environment.UpdateBatchUserId + '?lockboxid=' + LockboxId + '&lockboxDate=' + LockboxDate + '&batchid=' + BatchId  + '&updateUserid=' + UpdateUserId 
    console.log(url)
    return this.http.get(url)
      .map((response:Response) => response.json())
      .catch(this.handleError);
  }

  updateAccessTime(NewFlag, LockboxId, LockboxDate, BatchId, UpdateUserId, StartDate, EndDate, AccessType, Processed){
    let url = environment.UpdateAccessTime + 
      '?newflag=' + NewFlag + 
      '&lockboxid=' + LockboxId + 
      '&LockboxDate=' + LockboxDate + 
      '&batchid=' + BatchId  + 
      '&updateUserid=' + UpdateUserId  + 
      '&startDate=' + StartDate +
      '&enddate=' + EndDate + 
      '&accesstype=' + AccessType + 
      '&processed=' + Processed

    console.log(url)
    return this.http.get(url)
      .map((response:Response) => response.json())
      .catch(this.handleError);
  }

  genericService(url){
    return this.http.get(url)
      .map((response:Response) => response.json())
      .catch(this.handleError);
  }

  findSource(AWDTransId, AppId, UserId){
    let url = environment.FindSource + "?AWDObjId=" + AWDTransId + '&AppId=' + AppId + "&UserId=" + UserId
    console.log(url)
    return this.http.get(url)
      .map((response:Response) => response.json())
      .catch(this.handleError);
  }

  updateCaseStatus(AWDObjId, AppId, UserId, Comments, Status):Observable<IEResult[]>{
    let url = environment.UpdateCaseStatus + "?AWDObjId=" + AWDObjId + '&AppId=' + AppId + "&UserId=" + UserId + "&Comment=" + Comments + "&Status=" + Status 
    console.log(url)
    return this.http.get(url)
      .map((response:Response) => <IEResult[]>response.json())
      .catch(this.handleError);
  }

  deleteOldPLP(lockboxid, lockboxdate, batchid, batchnumber){
    let url = environment.DeleteOldPLP + "?lockboxid=" + lockboxid + '&lockboxdate=' + lockboxdate + "&batchid=" + batchid + "&batchnumber=" + batchnumber
    console.log(url)
    return this.http.get(url)
      .map((response:Response) => response.json())
      .catch(this.handleError);
  }

  InsertPLP(acct, loan, batchnumber, lockboxdate, lockboxid,  batchid, itemnumber, crda, loanamount, paytype, awduserid, comment, multiloan){
    let url = environment.InsertPLP + "?acct=" + acct + '&loan=' + loan + "&batchnumber=" + batchnumber + "&lockboxdate=" + lockboxdate +
            "&lockboxid=" + lockboxid + "&batchid=" + batchid + "&itemnumber=" + itemnumber + "&crda=" + crda + "&loanamount=" + loanamount +
            "&paytype=" + paytype + "&awduserid=" + awduserid + "&comment=" + comment + "&multiloan=" + multiloan
    console.log(url)
    return this.http.get(url)
      .map((response:Response) => response.json())
      .catch(this.handleError);
  }

  UpdateRepay(AWDUserId, ErrorMsg, Quality, ErrorVal, LockboxNumber, LoxboxDate, BatchNumber, BatchItemNumber){
    let url = environment.UpdateRepay + "?AWDUserId=" + AWDUserId + "&Error=" + ErrorMsg + "&Quality=" + Quality  + "&ErrorVal=" + ErrorVal + 
            "&LockboxNumber=" + LockboxNumber + "&BatchNumber=" + BatchNumber + "&BatchItemNumber=" + BatchItemNumber
    console.log(url)
    return this.http.get(url)
      .map((response:Response) => response.json())
      .catch(this.handleError);
  }


  GetBatchPLPs(lockboxid, lockboxdate, batchid){
    let url = environment.GetBatchPLPs + "?lockboxid=" + lockboxid + '&lockboxdate=' + lockboxdate + "&batchid=" + batchid 
    console.log(url)
    return this.http.get(url)
      .map((response:Response) => response.json())
      .catch(this.handleError);
  }

  GetObjectData(AWDObjId, AppId, UserId){
    let url = environment.GetObjectData + "?AWDObjId=" + AWDObjId + '&AppId=' + AppId + "&UserId="
    console.log(url)
    return this.http.get(url)
      .map((response:Response) => response.json())
      .catch(this.handleError);  
  }


  UpdateAWDObject4PLP(lockboxnumber, lockboxdate, batchnumber,PTPAccountId, LoanNumber, 
    SingleMultiLoanIndicator, batchitem, AWDObjId){
    let url = environment.UpdateAWDObject4PLP + "?lockboxnumber=" + lockboxnumber + '&lockboxdate=' + lockboxdate + "&batchnumber=" + batchnumber +
              "&LoanNumber=" + LoanNumber + "&smlind=" + SingleMultiLoanIndicator + "&batchitem=" + batchitem + "&AWDObjId=" + AWDObjId
    console.log(url)
    return this.http.get(url)
      .map((response:Response) => response.json())
      .catch(this.handleError);  
  }

  UpdateVSYS4PLP(lockboxnumber, lockboxdate, batchnumber,PTPAccountId, LoanNumber, 
    SingleMultiLoanIndicator, batchitem, AWDObjId){
    let url = environment.UpdateAWDObject4PLP + "?lockboxnumber=" + lockboxnumber + '&lockboxdate=' + lockboxdate + "&batchnumber=" + batchnumber +
              "&LoanNumber=" + LoanNumber + "&smlind=" + SingleMultiLoanIndicator + "&batchitem=" + batchitem + "&AWDObjId=" + AWDObjId
    console.log(url)
    return this.http.get(url)
      .map((response:Response) => response.json())
      .catch(this.handleError);  
  }

  CreateRelationship(AppId, UserId, Comment, ParentObjId, ChildObjId, ParentComment,  ChildComment)
  {
    let url = environment.CreateRelationship + "?AppId=" + AppId + "&ParentObjId=" + ParentObjId +
              "&ChildObjId=" + ChildObjId + "&ParentComment=" + ParentComment + "&ChildComment=" + ChildComment
    console.log(url)
    return this.http.get(url)
      .map((response:Response) => response.json())
      .catch(this.handleError);  
  }

  CreateWork(AppId, UserId, comment, LockedTo, AssignedTo, DocumentId, CreateWorkContext, fldLOB){
    let url = environment.CreateWork + "?AppId=" + AppId + '&UserId=' + UserId + "&Comment=" + comment +
              "&LockedTo=" + LockedTo + "&AssignedTo=" + AssignedTo + "&DocumentId=" + DocumentId + "&CreateWorkContext=" + CreateWorkContext +
              "&fldLOB=" + fldLOB
    console.log(url)
    var retCreatWork = this.http.get(url)
          .map((response:Response) => response.json())
          .catch(this.handleError); 
    console.log("retCreatWork: " + retCreatWork[0])
    return retCreatWork
  }
 
  LockInstance(ObjectId, UserId, AppId):Observable<IEResult[]>{
    let url = environment.LockInstance + "?AWDObjId=" + ObjectId + "&UserId=" + UserId + "&AppId=" + AppId
    console.log(url)
    return this.http.get(url)
      .map((response:Response) => <IEResult[]>response.json())
      .catch(this.handleError);  
  }

  UnlockInstance(ObjectId, UserId, AppId):Observable<IEResult[]>{
    let url = environment.UnlockInstance + "?AWDObjId=" + ObjectId + "&UserId=" + UserId + "&AppId=" + AppId
    console.log(url)
    return this.http.get(url)
      .map((response:Response) => <IEResult[]>response.json())
      .catch(this.handleError);  
  }
  public handleError(error: any) {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    let errMsg = (error.message) ? error.message :
        error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.log(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }


  UpdateAWDCaseStatus(AWDObjectId, appId, getUserId, AWDComment, AWDStatus):boolean{
    // Update the Case status from CREATED to PROCESSED 
    var retn:boolean
    var ResultData:Array<any>
    var outRes:string
    
    this.updateCaseStatus(AWDObjectId, appId, getUserId, AWDComment, AWDStatus )
    .subscribe(
      (data) => {
        ResultData = data
        outRes = data[0].Result
        retn = true
        console.log('updateCaseStatus Result: ' + outRes)
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

  UnlockAWDCase(awdCaseId, getUserId, appId){
    let unlockResult =  new Array<any>()
    this.UnlockInstance(awdCaseId, getUserId, appId)
    .subscribe(
      (data) => 
      { 
        unlockResult = data
        unlockResult.forEach(element => {
          console.log("UnlockInstance Result: " + element.Result)
        })
        
    },
    (error) => console.log('UnlockInstance Method Error Encountered: ' + error),
    () => console.log('UnlockInstance Success')
    );
  }

  UpdateObjectFields(awdObjId, appId, getUserId, comment, fldLOB ){
    let url = environment.UpdateObjectField + "?AWDObjId=" + awdObjId + '&AppId=' + appId + "&UserId=" + getUserId + "&Comment=" + comment +
              "&fldLOB=" + fldLOB
    console.log(url)
    return this.http.get(url)
      .map((response:Response) => response.json())
      .catch(this.handleError);  
  }

  UpdateBatch4ApprovedUser(lockboxid, lockboxdate, batchnumber, getUserId ){
    let url = environment.UpdateBatch4ApprovedUser + "?lockboxid=" + lockboxid + '&lockboxdate=' + lockboxdate + "&batchnumber=" + batchnumber +
              "&awdUserId=" + getUserId
    console.log(url)
    return this.http.get(url)
      .map((response:Response) => response.json())
      .catch(this.handleError);  
  }

  UpdateBatch4DeniedUser(lockboxid, lockboxdate, batchnumber, getUserId ){
    let url = environment.UpdateBatch4DeniedUser + "?lockboxid=" + lockboxid + '&lockboxdate=' + lockboxdate + "&batchnumber=" + batchnumber +
              "&awdUserId=" + getUserId
    console.log(url)
    return this.http.get(url)
      .map((response:Response) => response.json())
      .catch(this.handleError);  
  }

}
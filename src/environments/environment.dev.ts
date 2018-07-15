// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  production: false,
  Development: false,
  AppId:"VALICV2PIMP",
  DefaultUserId: "LMWFSVC",
  CreateWorkContext: "VSYS1389",
  GetProcessFlag: "http://dwsaaswise01/ValicBatchBalanceServices/api/bbapi/GetProcessFlag",
  FindSource: "http://dwsaaswise01/ValicBatchBalanceServices/api/bbapi/FindSource",
  UpdateObjectField: "http://dwsaaswise01/ValicBatchBalanceServices/api/bbapi/UpdateObjectField",
  UpdateCaseStatus: "http://dwsaaswise01/ValicBatchBalanceServices/api/bbapi/UpdateObjectStatus",
  UpdateBatchUserId:"http://dwsaaswise01/ValicBatchBalanceServices/api/bbapi/UpdateBatchUserId",
  UpdateBatch4ApprovedUser:"http://dwsaaswise01/ValicBatchBalanceServices/api/bbapi/UpdateBatch4ApprovedUser",
  UpdateBatch4DeniedUser:"http://dwsaaswise01/ValicBatchBalanceServices/api/bbapi/UpdateBatch4DeniedUser",
  GetProcBatchGridAPI: "http://dwsaaswise01/ValicBatchBalanceServices/api/bbapi/GetProcBatchGrid",
  GetLoanData: "http://dwsaaswise01/ValicBatchBalanceServices/api/bbapi/GetLoanData",
  GetBatchInfo: "http://dwsaaswise01/ValicBatchBalanceServices/api/bbapi/GetBatchInfo",
  UpdateAccessTime: "http://dwsaaswise01/ValicBatchBalanceServices/api/bbapi/UpdateAccessTime",
  DeleteOldPLP:         "http://dwsaaswise01/ValicBatchBalanceServices/api/bbapi/DeleteOldPLPs",
  InsertPLP:            "http://dwsaaswise01/ValicBatchBalanceServices/api/bbapi/InsertPLPs",
  UpdateRepay:          "http://dwsaaswise01/ValicBatchBalanceServices/api/bbapi/UpdateRepay",
  GetRepayInfoAPI:      "http://dwsaaswise01/ValicBatchBalanceServices/api/bbapi/GetRepayInfo",
  GetBatchPLPs:         "http://dwsaaswise01/ValicBatchBalanceServices/api/bbapi/GetBatchPLPs",
  GetObjectData:        "http://dwsaaswise01/ValicBatchBalanceServices/api/bbapi/GetObjectData",
  UpdateAWDObject4PLP:  "http://dwsaaswise01/ValicBatchBalanceServices/api/bbapi/UpdateAWDObject4PLP",
  CreateWork:           "http://dwsaaswise01/ValicBatchBalanceServices/api/bbapi/CreateWork",
  CreateRelationship: "http://dwsaaswise01/ValicBatchBalanceServices/api/bbapi/CreateRelationship",
  UnlockInstance: "http://dwsaaswise01/ValicBatchBalanceServices/api/bbapi/UnlockInstance",
  LockInstance: "http://dwsaaswise01/ValicBatchBalanceServices/api/bbapi/LockInstance",
  GetRepayPLP: "http://dwsaaswise01/ValicBatchBalanceServices/api/bbapi/GetRepayPLP",
  ImageViewerAPI: "http://dwsaaswise01/AIG_SS_ImageViewer/?appType=DEF&DocumentId",
  RestService: "http://dwsaaswise01.r1-core.r1.aig.net:8080/Aig.WC.ServicesV2/RestServices/" 
};



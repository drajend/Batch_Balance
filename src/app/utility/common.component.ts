import { Component, OnInit, Injectable} from '@angular/core';
import {Http} from '@angular/http'

@Injectable()
export class CommonUtility {

    //for Number only you can use this as
    onlyNumberKey(event) {
      return (event.charCode == 8 || event.charCode == 0) ? null : event.charCode >= 48 && event.charCode <= 57;
  }
  
//for Decimal you can use this as
onlyDecimalNumberKey(event) {
    let charCode = (event.which) ? event.which : event.keyCode;
    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57))
        return false;
    return true;
  }
  
  //omit_special_char
  omit_special_char(event)
  {   
     var k;  
     k = (event.which) ? event.which : event.keyCode;  //event.charCode;  //         k = event.keyCode;  (Both can be used)
     return((k >= 65 && k <= 90) || (k >= 97 && k <= 122) || (k == 45)); 
  }
  
  
    parseLocation = function(location) {
    var pairs = location.substring(1).split("&");
    var obj = {};
    var pair;
    var i;
    
    for ( i in pairs ) {
      if ( pairs[i] === "" ) continue;
  
      pair = pairs[i].split("=");
      obj[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
      console.log("Param Value: " + pair[1])
    }
    return obj;};
  
}
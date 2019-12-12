import Knex = require('knex');
import * as moment from 'moment';
import { ifError } from 'assert';

 export class ApptimeModel {

  public tableName  = 'app_time.userprofile';
  public primaryKey = 'id_user';
  public employeeNo ='employeeNo';
  public IMEI='IMEI';
  public  simserial='simserial';
  public deviceID='deviceID';
  public IMEI_expire='IMEI_expire';
  public id_user='id_user';
  

  list(knex: Knex,q='',filterby = 'employeeNo', limit = 1000, offset = 0) {
    let query = knex(this.tableName)
      //.whereRaw('kpi_year >= 2560')
      .orderBy('id_user','DESC')
      .limit(limit)
      .offset(offset);
      if(q==''){
        return query;
      }
      if(filterby == 'employeeCode'){
        return query.where({
          employeeNo : q
        });
      } else {
        
        return query.where('employeeNo','like','%' + q + '%')
        .orWhere('employeeCode','like','%' + q + '%');
      }
  }



  save(knex: Knex, datas: any) {
    return knex(this.tableName)
      .insert(datas);
  }

  update(knex: Knex, id: string, datas: any) {
    return knex(this.tableName)
      .where(this.primaryKey, id)
      .update(datas);
  }

  detail(knex: Knex, id: string) {
    return knex(this.tableName)
      .where(this.primaryKey, id);
  }

  remove(knex: Knex, id: string) {
    return knex(this.tableName)
      .where(this.primaryKey, id)
      .del();
  }
  
  queryuser(knex: Knex, employeeNo: string, IMEI:string,simserial:string,deviceID:string ){
    return knex(this.tableName)
    .where(this.employeeNo, employeeNo)
    .where(this.IMEI, IMEI)
    .where(this.simserial, simserial)
    .where(this.deviceID,deviceID);
  }

  queryemployeeNo(knex: Knex,employeeNo: string,)
  {
     return knex(this.tableName)
     .where(this.employeeNo,employeeNo);
  }

  queryuserexpire(knex: Knex, id_user:string , IMEI_expire:string, ){
    return knex(this.tableName)
    .where(this.primaryKey,id_user)
     .where(this.IMEI_expire,'<=' ,IMEI_expire);
    /*
    .where(this.employeeNo, employeeNo)
    .where(this.IMEI, IMEI)
    .where(this.simserial, simserial)
    .where(this.deviceID,deviceID)
*/
   
  
  }

  countH(knex: Knex, startdate:string , enddate:string )
  {

// return knex.raw(`SELECT (hour(timediff("2019-12-06 08:30:20","2019-12-06 15:51:10")) ) AS totalhours`);
//SELECT (hour(timediff('2019-12-06 08:30:20','2019-12-06 15:51:10')) ) AS totalhours
// return knex.raw(`SELECT (hour(timediff(?,?)) ) AS totalhours`,[startdate,enddate]);
return knex.raw(`SELECT (hour(timediff(?,?)) ) AS totalhours  `,[startdate,enddate]);


/*
  SELECT 
        (hour(
            timediff('2019-12-06 08:30:20', 
                     '2019-12-06 15:51:10')
            ) ) 
    AS totalhours

    return knex.raw(`SELECT 
    (hour(
        timediff(?, 
                 ?)
        ) ) 
AS totalhours`,[startdate,enddate]);
*/

  }

  


}
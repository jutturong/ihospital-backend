import Knex = require('knex');
import * as moment from 'moment';

export class RequestItemModel {

  public tableName = 'bloodbank_request_item';
  public primaryKey = 'ref';
  public an = 'an';

  list(knex: Knex, limit: number = 100, offset: number = 0) {
    return knex(this.tableName)
      .limit(limit)
      .offset(offset)
  }

  listByFk(knex: Knex, req_id: number) {
    let concat = knex.raw("concat('[',code2,'] ', name ,' [', abbr, ']') as fullname");
    return knex(this.tableName)
      .leftJoin('lab_code', 'bloodbank_request_item.item_code', 'lab_code.code2')
      .column('bloodbank_request_item.ref', 'bloodbank_request_item.req_id', 'lab_code.name', 'bloodbank_request_item.item_code', 'bloodbank_request_item.unit', 'bloodbank_request_item.ml', concat)
      .where('bloodbank_request_item.req_id', req_id)
      .orderBy('bloodbank_request_item.ref')
  }

  listByAn(knex: Knex, an: string) {
    return knex(this.tableName)
      .where('an', an)
      .orWhere('req_id', an)
      .groupBy('an')
      .orderBy('date', 'desc');
  }

  save(knex: Knex, datas: any) {
    return knex(this.tableName)
      .insert(datas);
  }


  update(knex: Knex, req_id: number, datas: any) {
    const firstData = datas[0] ? datas[0] : datas;
    return knex.raw(knex(this.tableName).insert(datas).toQuery() + " ON DUPLICATE KEY UPDATE " +
    Object.getOwnPropertyNames(firstData).map((field) => `${field}=VALUES(${field})`).join(", "));
  }

  detail(knex: Knex, ref: number) {
    return knex(this.tableName)
      .where(this.primaryKey, ref);
  }


  remove(knex: Knex, ref: number) {
    return knex(this.tableName)
      .where('ref', ref)
      .del();
  }

  getBloodRequestItem(knex: Knex, req_id: number) { 
    let dr_name = knex.raw("lib_dr.name as dr_name");
    let patient_name = knex.raw("concat(view_ipd_ipd.title, view_ipd_ipd.name , ' ', view_ipd_ipd.surname) as patient_name");
    let request_date = knex.raw("bloodbank_request.date as request_date");
    return knex(this.tableName)
      .column('*', dr_name, patient_name, request_date)   
      .leftJoin('bloodbank_request_item', 'bloodbank_request.req_id', 'bloodbank_request_item.req_id')
      .innerJoin('view_ipd_ipd', 'bloodbank_request.an', 'view_ipd_ipd.an')
      .leftJoin('lib_ward', 'view_ipd_ipd.ward', 'lib_ward.code')
      .leftJoin('lib_dr', 'bloodbank_request.dr_code', 'lib_dr.code')
      .leftJoin('bloodbank_lib_specimen', 'bloodbank_request.specimen', 'bloodbank_lib_specimen.specimen_id')
      .leftJoin('bloodbank_lib_request_for' , 'bloodbank_request.request_for', 'bloodbank_lib_request_for.request_for_id')
      .where('bloodbank_request.req_id', req_id);
  }

}
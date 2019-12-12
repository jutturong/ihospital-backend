import Knex = require('knex');
import * as moment from 'moment';

export class OpdFuModel {

  public db = 'hospdata'
  public tableName = 'hospdata.view_opd_fu';
  public primaryKey = 'vn';

  valCounter: any[] = [];
  valTemp: any[] = [];

  listAppointment(knex: Knex, limit: number = 3000, offset: number = 0) {
    return knex(this.tableName)
      .andWhere('dr', '38823')
      .andWhereBetween('fu_date', ['2019-03-01', '2019-03-31'])
      .orderBy('fu_date', 'ASC')
      .limit(limit)
      .offset(offset);
  }

  listAppointmentByDr(knex: Knex ) {
    return knex(this.tableName)
      .where('YEAR(fu_date)', '2019')
      .groupBy('req_id')
      .orderBy('fu_date', 'desc');
  }

  appointmentByVn(knex: Knex, vn: any, fu_date: any) { 
    return knex(this.tableName)
    .where('vn', vn)
    .andWhere('fu_date', fu_date)
    .groupBy('vn')
  }

  save(knex: Knex, datas: any) {
    return knex(this.tableName)
      .insert(datas)
      .returning('req_id');
  }

  updateCounter(knex: Knex, id: number, data: any) {
    return knex('template_autonumber_group')
      .where('id', id)
      .update(data);
  }

  getCurrentCounter(knex: Knex, id: 1) {
    return knex('template_autonumber_group')
      .where('id', id)
  }

  update(knex: Knex, req_id: number, data: any) {
    return knex(this.tableName)
      .where(this.primaryKey, req_id)
      .update(data);
  }

  detail(knex: Knex, req_id: number) {
    let patient_name = knex.raw("concat(view_ipd_ipd.title, view_ipd_ipd.name , ' ', view_ipd_ipd.surname) as patient_name");
    let request_date = knex.raw("bloodbank_request.date as request_date");
    let created_by = knex.raw("bloodbank_request.inp_id as created_by");

    let queryName1 = knex.raw(' (SELECT CONCAT(e.title, e.name, " ", e.surname) AS created_fullname FROM bloodbank_request r LEFT JOIN hospdata.employee e on r.collected_by = e.code WHERE r.req_id = '+ req_id +' GROUP BY e.code) AS created_fullname, (SELECT CONCAT(e.title, e.name, " ", e.surname) AS collected_fullname FROM bloodbank_request r LEFT JOIN hospdata.employee e on r.collected_by = e.code WHERE r.req_id = '+ req_id +' GROUP BY e.code) AS collected_fullname, (SELECT CONCAT(e.title, e.name, " ", e.surname) AS verify_fullname FROM bloodbank_request r LEFT JOIN hospdata.employee e on r.verify_by = e.code WHERE r.req_id = '+ req_id +' GROUP BY e.code)  AS  verify_fullname, (SELECT CONCAT(e.title, e.name, " ", e.surname) AS request_fullname FROM bloodbank_request r LEFT JOIN hospdata.employee e on r.dr_code = e.code WHERE r.req_id = ' + req_id + ' GROUP BY e.code) AS request_fullname');

    return knex(this.tableName)
      .column('bloodbank_request.*', 'view_ipd_ipd.*', 'bloodbank_request_item.*', patient_name, request_date, created_by, queryName1, 'lab_code.name AS lab_name', 'lab_code.abbr')
      .leftJoin('bloodbank_request_item', 'bloodbank_request.req_id', 'bloodbank_request_item.req_id')
      .innerJoin('view_ipd_ipd', 'bloodbank_request.an', 'view_ipd_ipd.an')
      .leftJoin('lib_ward', 'view_ipd_ipd.ward', 'lib_ward.code')
      .leftJoin('view_lab_test', 'bloodbank_request_item.item_code', 'view_lab_test.code2')
      .leftJoin('hospdata.employee', 'bloodbank_request.collected_by', 'hospdata.employee.code')
      .leftJoin('bloodbank_lib_specimen', 'bloodbank_request.specimen', 'bloodbank_lib_specimen.specimen_id')
      .leftJoin('bloodbank_lib_request_for', 'bloodbank_request.request_for', 'bloodbank_lib_request_for.request_for_id')
      .where('bloodbank_request.req_id', req_id)
  }

  detailRequest(knex: Knex, req_id: number) {
    return knex(this.tableName).leftJoin('bloodbank_request_item', 'bloodbank_request.req_id', 'bloodbank_request_item.req_id')
      .where('bloodbank_request.req_id', req_id);
  }

  reportBloodRequest(knex: Knex, req_id: number) {
    let input_name = knex.raw('CONCAT(en.title, en.name, " ", en.surname) AS input_name');
    let collected_name = knex.raw('CONCAT(ec.title, ec.name, " ", ec.surname) AS collected_name');
    let verify_name = knex.raw('CONCAT(ev.title, ev.name, " ", ev.surname) AS verify_name');
    let dr_name = knex.raw('CONCAT(ed.title, ed.name, " ", ed.surname) AS dr_name');
    let patient_name = knex.raw('CONCAT(p.title, p.name, " ", p.surname) AS patient_name');

    return knex.select("r.*", "t.code2", "p.birth", "p.sex AS psex", "i.item_code", "i.unit", 'i.ml', "t.name AS lab_name", "p.title", "p.name", "p.surname", patient_name, "d1.desc AS dx_name1", "d2.desc AS dx_name2", "d3.desc AS dx_name3", "p.ward_name", "s.specimen_name", "f.request_name", input_name, collected_name, verify_name, dr_name)
      .from('bloodbank_request AS r')  
      .leftJoin('bloodbank_request_item AS i', 'r.req_id', 'i.req_id')
      .leftJoin('view_lab_test AS t', 'i.item_code', 't.code2')
      .leftJoin('view_ipd_ipd AS p', 'r.an', 'p.an')
      .leftJoin('lib_icd10 AS d1', 'p.dx1', 'd1.code')
      .leftJoin('lib_icd10 AS d2', 'p.dx2', 'd2.code')
      .leftJoin('lib_icd10 AS d3', 'p.dx3', 'd3.code')
      .leftJoin('employee AS en', 'r.inp_id', 'en.code')
      .leftJoin('employee AS ec', 'r.collected_by', 'ec.code')
      .leftJoin('employee AS ev', 'r.verify_by', 'ev.code')
      .leftJoin('employee AS ed', 'r.dr_code', 'ed.code')
      .leftJoin('bloodbank_lib_specimen AS s', 'r.specimen', 's.specimen_id')
      .leftJoin('bloodbank_lib_request_for AS f', 'r.request_for', 'f.request_for_id')
      .where('r.req_id', req_id)
  }

  viewBloodRequest(knex: Knex, req_id: number) { 
    let input_name = knex.raw('CONCAT(en.title, en.name, " ", en.surname) AS input_name');
    let collected_name = knex.raw('CONCAT(ec.title, ec.name, " ", ec.surname) AS collected_name');
    let verify_name = knex.raw('CONCAT(ev.title, ev.name, " ", ev.surname) AS verify_name');
    let dr_name = knex.raw('CONCAT(ed.title, ed.name, " ", ed.surname) AS dr_name');
    let patient_name = knex.raw('CONCAT(p.title, p.name, " ", p.surname) AS patient_name');
    let full_name = knex.raw('CONCAT("[", t.code2, "] ", t.name) AS full_name');

    return knex.select("r.*", "g.abo_type", 'g.rh_detail_result', 'g.rh_result', "t.code2", "i.ref", "i.item_code", "i.unit", 'i.ml', "t.name AS lab_name", "p.title", "p.name", "p.surname", patient_name, "d1.desc AS dx_name1", "d2.desc AS dx_name2", "d3.desc AS dx_name3", "p.ward_name", "s.specimen_name", "f.request_name", input_name, collected_name, verify_name, dr_name, full_name)
      .from('bloodbank_request AS r')  
      .leftJoin('bloodbank_request_item AS i', 'r.req_id', 'i.req_id')
      .leftJoin('view_lab_test AS t', 'i.item_code', 't.code2')
      .leftJoin('view_ipd_ipd AS p', 'r.an', 'p.an')
      .leftJoin('lib_icd10 AS d1', 'p.dx1', 'd1.code')
      .leftJoin('lib_icd10 AS d2', 'p.dx2', 'd2.code')
      .leftJoin('lib_icd10 AS d3', 'p.dx3', 'd3.code')
      .leftJoin('employee AS en', 'r.inp_id', 'en.code')
      .leftJoin('employee AS ec', 'r.collected_by', 'ec.code')
      .leftJoin('employee AS ev', 'r.verify_by', 'ev.code')
      .leftJoin('employee AS ed', 'r.dr_code', 'ed.code')
      .leftJoin('bloodbank_lib_specimen AS s', 'r.specimen', 's.specimen_id')
      .leftJoin('bloodbank_lib_request_for AS f', 'r.request_for', 'f.request_for_id')
      .leftJoin('bloodbank_grouping AS g' , 'r.req_id', 'g.req_id')
      .where('r.req_id', req_id)
  }

  getBloodRequirment(knex: Knex) { 
    return knex('bloodbank_lib_requirment');
  }

  getBloodRequestfor(knex: Knex) { 
    return knex('bloodbank_lib_request_for');
  }

  getBloodSpecimen(knex: Knex) { 
    return knex('bloodbank_lib_specimen');
  }

  getBloodType(knex: Knex) {
    return knex('bloodbank_lib_type');
  }

  getlabCode(knex: Knex) {
    return knex('view_lab_test');
  }

  remove(knex: Knex, req_id: string) {
    return knex(this.tableName)
      .where(this.primaryKey, req_id)
      .del();
  }
}
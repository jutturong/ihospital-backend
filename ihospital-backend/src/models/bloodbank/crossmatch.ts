import Knex = require('knex');
import * as moment from 'moment';

export class CrossmatchModel {

  public tableName = 'bloodbank_crossmatch';
  public primaryKey = 'crossmatch_id';

  list(knex: Knex, limit: number = 100, offset: number = 0) {
    return knex(this.tableName)
      .offset(offset);
  }

  listByFk(knex: Knex, req_id: number, limit: number = 100, offset: number = 0) { 
    return knex(this.tableName)
      .where('req_id', req_id)
      .offset(offset);
  }

  listByPk(knex: Knex, crossmatch_id: any, limit: number = 100, offset: number = 0) { 
    let input_name = knex.raw('CONCAT(en.title, en.name, " ", en.surname) AS input_name');
    let collected_name = knex.raw('CONCAT(ec.title, ec.name, " ", ec.surname) AS collected_name');
    let verify_name = knex.raw('CONCAT(ev.title, ev.name, " ", ev.surname) AS verify_name');
    let dr_name = knex.raw('CONCAT(ed.title, ed.name, " ", ed.surname) AS dr_name');
    let patient_name = knex.raw('CONCAT(p.title, p.name, " ", p.surname) AS patient_name');
    let full_name = knex.raw('CONCAT("[", t.code2, "] ", t.name) AS full_name');

    return knex.select("c.*", "r.*", "p.birth", "sm.lab_no", "g.abo_type", "t.code2", "i.ref", "i.item_code", "i.unit", 'i.ml', "t.name AS lab_name", "t.price", "p.title", "p.name", "p.surname", patient_name, "d1.desc AS dx_name1", "d2.desc AS dx_name2", "d3.desc AS dx_name3", "p.ward_name", "s.specimen_name", "f.request_name", input_name, collected_name, verify_name, dr_name, full_name)
      .from('bloodbank_crossmatch AS c')
      .leftJoin('bloodbank_specimen AS sm', 'c.req_id', 'sm.req_id')
      .leftJoin('bloodbank_request AS r', 'c.req_id', 'r.req_id')  
      .leftJoin('bloodbank_request_item AS i', 'r.req_id', 'i.req_id')
      .leftJoin('view_lab_test AS t', 'i.item_code', 't.code2')
      .innerJoin('view_ipd_ipd AS p', 'r.an', 'p.an')
      .leftJoin('lib_icd10 AS d1', 'p.dx1', 'd1.code')
      .leftJoin('lib_icd10 AS d2', 'p.dx2', 'd2.code')
      .leftJoin('lib_icd10 AS d3', 'p.dx3', 'd3.code')
      .leftJoin('employee AS en', 'r.inp_id', 'en.code')
      .leftJoin('employee AS ec', 'r.collected_by', 'ec.code')
      .leftJoin('employee AS ev', 'r.verify_by', 'ev.code')
      .leftJoin('employee AS ed', 'r.dr_code', 'ed.code')
      .leftJoin('bloodbank_lib_specimen AS s', 'r.specimen', 's.specimen_id')
      .leftJoin('bloodbank_lib_request_for AS f', 'r.request_for', 'f.request_for_id')
      .leftJoin('bloodbank_grouping AS g' , 'c.req_id', 'g.req_id')
      .whereIn('crossmatch_id', crossmatch_id)
      .groupBy('crossmatch_id')
  }

  save(knex: Knex, datas: any) {
    return knex(this.tableName)
      .insert(datas)
      .returning('req_id');
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

 
  remove(knex: Knex, id: number) {
    return knex(this.tableName)
      .where('id', id)
      .del();
  }
}
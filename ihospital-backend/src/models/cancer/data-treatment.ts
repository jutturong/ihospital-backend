import Knex = require('knex');
import * as moment from 'moment';

export class DataTreatmentModel {

  public db = 'app_cahis'
  public tableName = 'app_cahis.data_treatment';
  public primaryKey = 'treatment_id';

  valCounter: any[] = [];
  valTemp: any[] = [];

  async getPatientTrt(db: Knex, hn){
    const sql = `SELECT f.an, 
      (CASE 
          WHEN f.an = '' THEN 1
          WHEN f.an IS NULL THEN 1
          ELSE 2
      END) AS opd_ipd_code, p.text, v.pttype,  r.item, lrx.name, r.icdcm, f.fu_date, r.date
        FROM opd_visit v
        INNER JOIN opd_rx r on v.vn = r.vn
        LEFT JOIN opd_fu f on v.vn = f.vn
        LEFT JOIN lib_rx_code_opd lrx on r.item = lrx.code
        LEFT JOIN lib_pttype p on v.pttype = p.code
        WHERE v.hn = "${hn}"`;
    const results = await db.raw(sql);
    return results[0];
  }

  async getPatientTrtHis(db: Knex, hn){
    const sql = `SELECT f.an, 
      (CASE 
          WHEN f.an = '' THEN 1
          WHEN f.an IS NULL THEN 1
          ELSE 2
          END) AS opd_ipd_code, p.code, p.text, v.pttype, r.item AS opdItem, lrx.name, r.icdcm, f.fu_date, r.date
          FROM opd_visit v
        INNER JOIN opd_rx r on v.vn = r.vn
        LEFT JOIN opd_fu f on v.vn = f.vn
        LEFT JOIN lib_rx_code_opd lrx on r.item = lrx.code
        LEFT JOIN lib_pttype p on v.pttype = p.code
        WHERE v.hn = "${hn}"`;
    const results = await db.raw(sql);
    return results[0];
  }

  async getDataTrt(knex: Knex, cancerId: any){ 
  const sql = `SELECT t.import_type, t.ICD9CM, t.ICD9CMDetail, t.icd9cm_kkh, t.admit_number, t.doctor_id, d.name AS dr_name, t.hos_code, t.trt_code, t.treatment_id, trt_consult_date,
    t.trt_date, t.trt_doctor_consult_date, t.trt_end_date, h.name AS hospname, t.detail, bt.*, p.text
    FROM app_cahis.data_treatment t 
    LEFT JOIN hospdata.lib_hospcode h ON t.hos_code = h.code5
    LEFT JOIN hospdata.lib_dr d on t.doctor_id = d.ref
    LEFT JOIN app_cahis.bd_treattype bt ON t.trt_code = bt.TreatTypeCode
    LEFT JOIN hospdata.lib_pttype p ON t.trt_right_code = p.code
    WHERE t.cancer_id = "${cancerId}"`
    const result = await knex.raw(sql);
      return result[0];
    }

  async getDataTrtById(knex: Knex, treatment_id: any){
   const sql = `SELECT t.import_type, t.treatment_id, t.cancer_id, t.ICD9CMDetail, h.code5, h.name, t.trt_date, t.trt_end_date, t.admit_number, t.ICD9CM, bt.*, t.doctor_id, d.name AS dr_name, t.trt_code, t.trt_right_code, t.detail FROM app_cahis.data_treatment t
   LEFT JOIN hospdata.lib_hospcode h ON t.hos_code = h.code5
   LEFT JOIN hospdata.lib_dr d ON t.doctor_id = d.ref
   LEFT JOIN app_cahis.bd_treattype bt ON t.trt_code = bt.TreatTypeCode
   WHERE t.treatment_id = "${treatment_id}"`

   const result = await knex.raw(sql);
    return result[0];
  }

  list(knex: Knex, limit: number = 100, offset: number = 0) {
    return knex(this.tableName)
      .limit(limit)
      .offset(offset);
  }

  listByFk(knex: Knex, fk: any) {
    return knex(this.tableName)
      .where('cancer_id', fk)
      .orderBy('trt_date', 'desc');
  }

  save(knex: Knex, data: any) {
    return knex(this.tableName)
      .insert(data)
      .returning('*')
      .bind(console)
      .then(console.log)
      .catch(console.error);  
    }

  update(knex: Knex, treatment_id: number, data: any) {
    return knex(this.tableName)
      .where('data_treatment.treatment_id', treatment_id)
      .update(data);
  }

  updateAll(knex: Knex, treatment_id: number, datas: any) {
    const firstData = datas[0] ? datas[0] : datas;
    return knex.raw(knex(this.tableName).insert(datas).toQuery() + " ON DUPLICATE KEY UPDATE " +
    Object.getOwnPropertyNames(firstData).map((field) => `${field}=VALUES(${field})`).join(", "));
  }


  remove(knex: Knex, treatment_id: string) {
    return knex(this.tableName)
      .where(this.primaryKey, treatment_id)
      .del();
  }
}
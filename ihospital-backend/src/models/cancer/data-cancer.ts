import Knex = require('knex');
import * as moment from 'moment';

export class DataCancerModel {

  public db = 'app_cahis'
  public tableName = 'app_cahis.data_cancer';
  public primaryKey = 'cancer_id';
  public an = 'an';

  valCounter: any[] = [];
  valTemp: any[] = [];

  list(knex: Knex, limit: number = 100, offset: number = 0) {
    return knex(this.tableName)
      .limit(limit)
      .offset(offset);
  }

  listByFk(knex: Knex, fk: any) {
    return knex(this.tableName)
      .where('an', fk)
      .orWhere('req_id', fk)
      .groupBy('req_id')
      .orderBy('date', 'desc');
  }

  save(knex: Knex, data: any) {
    return knex(this.tableName)
      .insert(data)
  }

  update(knex: Knex, cancer_id: number, data: any) {
    return knex(this.tableName)
      .where('data_cancer.cancer_id', cancer_id)
      .update(data);
  }


  async getDataTrt(knex: Knex, cancerId: any) {
    const sql = `SELECT t.ICD9CM, t.ICD9CMDetail, t.admit_number, t.doctor_id, d.name AS dr_name, t.hos_code, t.trt_code, t.treatment_id, trt_consult_date,
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


  async getCancerAlready(knex: Knex, hn: any) {

    const sql = `SELECT * FROM app_cahis.data_cancer c 
                  LEFT JOIN  hospdata.lib_hospcode h ON c.hos_code = h.code5
                  LEFT JOIN  app_cahis.bd_organ o ON c.topo = o.OrganCode
                  LEFT JOIN  app_cahis.bd_mor m ON c.morpho = m.MorId
                  LEFT JOIN  app_cahis.bd_behaviour b ON c.behaviour_code = BehaviourCode
                  WHERE c.hn_code = "${hn}"`;
    const result = await knex.raw(sql);
    return result[0];
  }

  // getCancerNew(knex: Knex, hn: any){
  //   return knex('*').from('app_cahis.data_cancer')
  //   .leftJoin('app_cahis.hospital', 'data_cancer.hos_code', 'hospital.HosCode')
  //   .leftJoin('app_cahis.bd_organ', 'data_cancer.topo', 'bd_organ.OrganCode')
  //   .leftJoin('app_cahis.bd_mor', 'data_cancer.morpho', 'bd_mor.MorId')
  //   .where('data_cancer.hn_code', hn)
  // }

  async getCancerHis(knex: Knex, hn: any) {
    const sql = `SELECT DISTINCT c.title, c.name, c.surname, c.no_card, c.birth, c.sex, c.prov, c.moo, c.tambol, c.amp, c.zip, c.address,
    CASE c.sex WHEN '1' THEN 'ชาย'
    WHEN '2' THEN 'หญิง' ELSE c.sex
    END AS sex_2, 
        c.marry, h.name as marry_text, c.add, c.nation, d.text, c.race, e.text, c.ethnic, f.text, '10670' AS hcode, a.hn, 
        a.date AS diag_date,
        (PERIOD_DIFF(DATE_FORMAT(a.date, '%Y%m'), DATE_FORMAT(c.birth, '%Y%m'))) DIV 12 AS diag_age,
        a.status AS status_diag, g.text AS status_diag_text, b.diag AS icd10, i.max_date, i.max_status, 
        j.date AS patho_date, j.patho_no, j.diagnosis, j.type, j.hosp, a.status AS die, ds.text AS status_detail, a.hospmain, a.hospsub, a.refer, a.vn
    FROM opd_visit a INNER JOIN opd_dx b ON a.vn = b.vn AND b.diag BETWEEN 'C00' AND 'C99'
        LEFT JOIN patient c ON a.hn = c.hn
        LEFT JOIN lib_nation d ON c.nation = d.code
        LEFT JOIN lib_nation e ON c.race = e.code
        LEFT JOIN lib_religion f ON c.ethnic = f.code
        LEFT JOIN lib_opd_result g ON a.status = g.code
        LEFT JOIN lib_marriage h ON c.marry = h.code
        LEFT JOIN lib_discht ds ON a.status = ds.code
        LEFT JOIN(SELECT aa.hn, MAX(aa.date)AS max_date, aa.status, bb.text AS max_status FROM
        opd_visit aa LEFT JOIN lib_opd_result bb ON aa.status = bb.code
    WHERE aa.hn 
    IN(SELECT DISTINCT a.hn
        FROM opd_visit a INNER JOIN opd_dx b ON a.vn = b.vn
        AND b.diag BETWEEN 'C00'
        AND 'C99' 
	  WHERE a.hn = "${hn}"
        ORDER BY a.hn)
        GROUP BY aa.hn
      )i ON a.hn = i.hn
        INNER JOIN(SELECT a.patho_no, a.type, a.hosp, a.date, a.hn, b.diagnosis
        FROM pathology_patho a
        LEFT JOIN pathology_diagnosis b ON a.patho_no = b.patho_no
	  WHERE (a.patho_no is not null or a.patho_no <> '') 
      )j ON a.hn = j.hn AND a.date = j.date
    WHERE a.hn = "${hn}"
    ORDER BY a.vn DESC
    LIMIT 1`
    const result = await knex.raw(sql);
    return result[0];
  }

  async getCancerNew(knex: Knex, hn: any) {
    const sql = `SELECT c.title, c.name, c.surname, c.no_card, c.birth, c.sex,
	              CASE c.sex
                WHEN '1' THEN 'ชาย'
                WHEN '2' THEN 'หญิง'
                ELSE c.sex END AS sex_2,
                c.marry, h.name, c.add, c.nation, d.text, c.race, e.text, c.ethnic, f.text, '10670' AS hcode, a.hn, a.date AS diag_date,		
                DATE_FORMAT(c.birth, '%Y%m')DIV 12 AS diag_age,
                a.status AS status_diag,
                g.text AS status_diag_text,
                b.diag AS icd10,
                i.max_date,
                i.max_status,
                j.patho_no,
                j.diagnosis
                FROM
	              opd_visit a
                INNER JOIN opd_dx b ON a.vn = b.vn
                AND b.diag BETWEEN 'C00'
                AND 'C99'
                LEFT JOIN patient c ON a.hn = c.hn
                LEFT JOIN lib_nation d ON c.nation = d.code
                LEFT JOIN lib_nation e ON c.race = e.code
                LEFT JOIN lib_religion f ON c.ethnic = f.code
                LEFT JOIN lib_opd_result g ON a.status = g.code
                LEFT JOIN lib_marriage h ON c.marry = h.code
                LEFT JOIN(SELECT aa.hn, MAX(aa.date)AS max_date, aa.status, bb.text AS max_status
	              FROM opd_visit aa
	              LEFT JOIN lib_opd_result bb ON aa.status = bb.code
	              WHERE aa.hn IN(SELECT DISTINCT a.hn FROM opd_visit a
			          INNER JOIN opd_dx b ON a.vn = b.vn AND b.diag BETWEEN 'C00' AND 'C99'
			          WHERE a.date BETWEEN '2017-01-01' AND '2017-12-31' ORDER BY a.hn)
                GROUP BY aa.hn )i ON a.hn = i.hn 
                LEFT JOIN(SELECT a.patho_no, a.date, a.hn, b.diagnosis FROM pathology_patho a
	              LEFT JOIN pathology_diagnosis b ON a.patho_no = b.patho_no) j ON a.hn = j.hn AND a.date = j.date WHERE
	              (a.hn, a.vn)IN(SELECT a.hn, a.vn FROM opd_visit a INNER JOIN opd_dx b ON a.vn = b.vn
		            AND b.diag BETWEEN 'C00' AND 'C99'
		            WHERE a.hn IN(SELECT DISTINCT a.hn FROM opd_visit a INNER JOIN opd_dx b ON a.vn = b.vn
				        AND b.diag BETWEEN 'C00'
				        AND 'C99'
				        WHERE a.hn = "${hn}" 
				        ORDER BY a.hn
			          )
                GROUP BY a.hn
		            HAVING MIN(a.date)LIKE '2017-%'
	              )
                GROUP BY c.hn
                ORDER BY a.hn`
    const result = await knex.raw(sql);
    return result[0];
  }

  getCancerById(knex: Knex, cancer_id: any) {
    return knex('*').from('app_cahis.data_cancer')
      .leftJoin('app_cahis.hospital', 'data_cancer.hos_code', 'hospital.HosCode')
      .leftJoin('app_cahis.bd_organ', 'data_cancer.topo', 'bd_organ.OrganCode')
      .leftJoin('app_cahis.bd_mor', 'data_cancer.morpho', 'bd_mor.MorId')
      .where('data_cancer.cancer_id', cancer_id)
  }

  remove(knex: Knex, req_id: string) {
    return knex(this.tableName)
      .where(this.primaryKey, req_id)
      .del();
  }
}
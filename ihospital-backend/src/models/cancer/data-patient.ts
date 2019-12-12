import Knex = require('knex');
import * as moment from 'moment';
import { fork } from 'child_process';

export class DataPatientModel {

  public db = 'hospdata'
  public tableName = 'hospdata.patient';
  public primaryKey = 'ref';

  valCounter: any[] = [];
  valTemp: any[] = [];

  list(knex: Knex, limit: number = 100, offset: number = 0) {
    return knex(this.tableName)
      .limit(limit)
      .orderBy('hn', 'desc')
      .offset(offset);
  }

  getDataPatientByHn(knex: Knex, hn: any) {
    return knex('app_cahis.data_patient')
      .leftJoin('app_cahis.data_cancer', 'data_patient.patient_id', 'data_cancer.patient_id')
      .where('data_patient.hn_code', hn)
      .orderBy('data_patient.create_date', 'desc')
      .limit(1)
  }

  async getPatient(db: Knex, fk){
    const sql = `SELECT DISTINCT p.hn, p.age, p.title, p.name, p.surname, p.no_card, p.birth, p.sex, p.prov, p.moo, p.tambol, p.amp, p.zip, p.address,
    CASE p.sex WHEN '1' THEN 'ชาย'
    WHEN '2' THEN 'หญิง' ELSE p.sex
    END AS sex_2,
    p.marry, h.name as marry_text, p.add, p.nation, d.text, p.race, e.text, p.ethnic, f.text, '10670' AS hcode
    FROM patient p
    LEFT JOIN lib_nation d ON p.nation = d.code
    LEFT JOIN lib_nation e ON p.race = e.code
    LEFT JOIN lib_religion f ON p.ethnic = f.code
    LEFT JOIN lib_marriage h ON p.marry = h.code
    WHERE p.hn = "${fk}" OR p.no_card = "${fk}"
    `
    const result = await db.raw(sql);
    return result[0];
    
  }

  async getPatientCancerNew(db: Knex, fk) {
    const sql = `SELECT DISTINCT c.title, c.name, c.surname, c.no_card, c.birth, c.sex, c.prov, c.moo, c.tambol, c.amp, c.zip, c.address,
    CASE c.sex WHEN '1' THEN 'ชาย'
    WHEN '2' THEN 'หญิง' ELSE c.sex
    END AS sex_2, 
        c.marry, h.name as marry_text, c.add, c.nation, d.text, c.race, e.text, c.ethnic, f.text, '10670' AS hcode, a.hn, 
        a.date AS diag_date,
        (PERIOD_DIFF(DATE_FORMAT(a.date, '%Y%m'), DATE_FORMAT(c.birth, '%Y%m'))) DIV 12 AS diag_age,
        a.status AS status_diag, g.text AS status_diag_text, b.diag AS icd10, i.max_date, i.max_status, 
        j.date AS patho_date, j.patho_no, j.diagnosis, j.type, j.hosp, a.status AS die, ds.text AS status_detail, a.hospmain, a.hospsub, a.vn
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
	  WHERE  a.date between '2018-10-01' AND '2018-10-31' AND a.hn = "${fk}"
        ORDER BY a.hn)
        GROUP BY aa.hn
      )i ON a.hn = i.hn
        INNER JOIN(SELECT a.patho_no, a.type, a.hosp, a.date, a.hn, b.diagnosis
        FROM pathology_patho a
        LEFT JOIN pathology_diagnosis b ON a.patho_no = b.patho_no
	  WHERE (a.patho_no is not null or a.patho_no <> '') 
      )j ON a.hn = j.hn AND a.date = j.date
    WHERE  a.date between '2018-10-01' AND '2018-10-31' AND a.hn = "${fk}"
    ORDER BY a.vn DESC
    LIMIT 1`
    const result = await db.raw(sql);
    return result[0];
  }

  async getPtNew(db: Knex, hn) {
    const sql = `SELECT DISTINCT c.title, c.name, c.surname, c.no_card, c.birth, c.sex, c.prov, c.moo, c.tambol, c.amp, c.zip, c.address,
        c.marry, h.name as marry_text, c.add, c.nation, d.text, c.race, e.text, c.ethnic, f.text, '10670' AS hcode, a.hn, 
        a.date AS diag_date,
        (PERIOD_DIFF(DATE_FORMAT(a.date, '%Y%m'), DATE_FORMAT(c.birth, '%Y%m'))) DIV 12 AS diag_age,
        a.status AS status_diag, g.text AS status_diag_text, b.diag AS icd10, i.max_date, i.max_status, 
        j.date AS patho_date, j.patho_no, j.diagnosis, j.type, j.hosp, a.status AS die, a.hospmain, a.hospsub, a.vn
    FROM opd_visit a INNER JOIN opd_dx b ON a.vn = b.vn AND b.diag BETWEEN 'C00' AND 'C99'
        LEFT JOIN patient c ON a.hn = c.hn
        LEFT JOIN lib_nation d ON c.nation = d.code
        LEFT JOIN lib_nation e ON c.race = e.code
        LEFT JOIN lib_religion f ON c.ethnic = f.code
        LEFT JOIN lib_opd_result g ON a.status = g.code
        LEFT JOIN lib_marriage h ON c.marry = h.code
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
	  GROUP BY j.patho_no
    ORDER BY a.vn DESC`
    const result = await db.raw(sql);
    return result[0];
  }

  async getPatientCancerOld(db: Knex, date) {
    const sql = `SELECT c.title, c.name, c.surname, c.no_card, c.birth, c.sex,
	              CASE c.sex
                WHEN '1' THEN 'ชาย'
                WHEN '2' THEN 'หญิง'
                ELSE c.sex END AS sex_2,
                c.marry, h.name, c.add, c.nation, d.text, c.race, e.text, c.ethnic, f.text, '10670' AS hcode, a.hn, a.date AS diag_date,		
                DATE_FORMAT(c.birth, '%Y%m')))DIV 12 AS diag_age,
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
				        WHERE a.date BETWEEN '2017-01-01' AND '2017-12-31' 
				        ORDER BY a.hn
			          )
                GROUP BY a.hn
		            HAVING MIN(a.date)LIKE '2017-%'
	              )
                GROUP BY c.hn
                ORDER BY a.hn`
    const result = await db.raw(sql);
    return result[0];
  }

  // getPatientCancerByFk(knex: Knex, fk: any) {
  //   return knex(this.tableName)
  //     .where('hn', fk)
  //     .orWhere('no_card', fk)
  //     .orderBy('hn', 'DESC')
  //     .limit(1)
  // }

  listByFk(knex: Knex, fk: any) {
    return knex(this.tableName)
      .where('an', fk)
      .orWhere('req_id', fk)
      .groupBy('req_id')
      .orderBy('date', 'desc');
  }

  save(knex: Knex, data: any) {
    return knex('app_cahis.data_patient')
      .insert(data)
  }

  update(knex: Knex, patient_id: number, data: any) {
    return knex('app_cahis.data_patient')
      .where('patient_id', patient_id)
      .update(data)
      .returning('patient_id');
  }

  getPtAlready(knex: Knex, hn: any) {
    return knex('app_cahis.data_patient')
      .where('hn_code', hn)
      .limit(1);
  }

  remove(knex: Knex, req_id: string) {
    return knex(this.tableName)
      .where(this.primaryKey, req_id)
      .del();
  }
}
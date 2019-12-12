import Knex = require('knex');
import * as moment from 'moment';

export class LibDataModel {


  valCounter: any[] = [];
  valTemp: any[] = [];

  listTitle(knex: Knex, limit: number = 100, offset: number = 0) {
    return knex('hospdata.lib_titles')
      .limit(limit)
      .offset(offset);
  }

  listTopo(knex: Knex, limit: number = 100, offset: number = 0) {
    return knex('app_cahis.bd_organ')
      .limit(limit)
      .offset(offset);
  }

  listTopoByCode(knex: Knex, code: any) {
    return knex('app_cahis.bd_organ')
      .whereRaw("(concat('[', `OrganCode` ,']', ' ', `OrganDesc`) LIKE ?)", `%${code}%`)
  }

  listIcd9cm(knex: Knex, limit: number = 100, offset: number = 0) {
    return knex('app_cahis.bd_icd9cm')
      .limit(limit)
      .offset(offset);
  }

  listIcd9cmByCode(knex: Knex, code: any) {
    return knex('app_cahis.bd_icd9cm')
      .whereRaw("(concat('[', `CODE` ,']', ' ', `DESCRIPTION`) LIKE ?)", `%${code}%`)

  }

  listMor(knex: Knex, limit: number = 100, offset: number = 0) {
    return knex('app_cahis.bd_mor')
      .limit(limit)
      .offset(offset);
  }

  listMorByCode(knex: Knex, code: any) {
    return knex('app_cahis.bd_mor')
      .whereRaw("(concat('[', `MorCode` ,']', ' ', `Desc`) LIKE ?)", `%${code}%`)

  }

  listTnm(knex: Knex, limit: number = 100, offset: number = 0) {
    return knex('app_cahis.bd_tnm_stage_2016')
      .limit(limit)
      .offset(offset);
  }

  listTnmByCode(knex: Knex, code: any) {
    return knex('app_cahis.tnm')
      .whereRaw("STAGE", `%${code}%`)

  }

  listLaterality(knex: Knex, limit: number = 100, offset: number = 0) {
    return knex('app_cahis.bd_laterality')
      .limit(limit)
      .offset(offset);
  }

  listBehaviour(knex: Knex, limit: number = 100, offset: number = 0) {
    return knex('app_cahis.bd_behaviour')
      .limit(limit)
      .offset(offset);
  }

  listStage(knex: Knex, limit: number = 100, offset: number = 0) {
    return knex('app_cahis.bd_stage')
      .limit(limit)
      .offset(offset);
  }

  listGrade(knex: Knex, limit: number = 100, offset: number = 0) {
    return knex('app_cahis.bd_grade')
      .limit(limit)
      .offset(offset);
  }

  listExtend(knex: Knex, limit: number = 100, offset: number = 0) {
    return knex('app_cahis.bd_extend')
      .limit(limit)
      .offset(offset);
  }

  listT(knex: Knex, limit: number = 100, offset: number = 0) {
    return knex('app_cahis.bd_t')
      .limit(limit)
      .offset(offset);
  }

  listN(knex: Knex, limit: number = 100, offset: number = 0) {
    return knex('app_cahis.bd_n')
      .limit(limit)
      .offset(offset);
  }

  listM(knex: Knex, limit: number = 100, offset: number = 0) {
    return knex('app_cahis.bd_m')
      .limit(limit)
      .offset(offset);
  }

  listMetastasis(knex: Knex, limit: number = 100, offset: number = 0) {
    return knex('app_cahis.bd_')
      .limit(limit)
      .offset(offset);
  }

  listLife(knex: Knex, limit: number = 100, offset: number = 0) {
    return knex('app_cahis.bd_lifestatus')
      .limit(limit)
      .offset(offset);
  }

  listMarital(knex: Knex, limit: number = 100, offset: number = 0) {
    return knex('hospdata.lib_marriage')
      .limit(limit)
      .offset(offset);
  }

  listProvince(knex: Knex, limit: number = 100, offset: number = 0) {
    return knex('app_cahis.bd_health_region')
      .limit(limit)
      .offset(offset);
  }

  listByFk(knex: Knex, fk: any) {
    return knex('app_cahis.bd_icd9cm')
      .where('an', fk)
      .orWhere('req_id', fk)
      .groupBy('req_id')
      .orderBy('date', 'desc');
  }

  listSitegroupByCode(knex: Knex, code: any) {
    return knex('app_cahis.bd_sitegroup')
      .where('icd10_list', 'C11')
      .orderBy('group_id', 'ASC')
      .limit(1)
  }


  listTreattype(knex: Knex, limit: number = 100, offset: number = 0) {
    return knex('app_cahis.bd_treattype')
      .limit(limit)
      .offset(offset);
  }

  listTreatRx(knex: Knex, limit: number = 100, offset: number = 0) {
    return knex('hospdata.lib_rx_type_cancer')
      .limit(limit)
      .offset(offset);
  }

  listHospital(knex: Knex, limit: number = 100, offset: number = 1) {
    return knex('hospdata.lib_hospcode')
      .whereIn('lib_hospcode.typecode', ['05', '15', '16'])
      .limit(limit)
      .offset(offset);
  }

  listHospitalByCode(knex: Knex, code: any) {
    return knex('hospdata.lib_hospcode')
      .orWhere('lib_hospcode.code5', '=', `${code}`)
      .orWhere('lib_hospcode.name', 'LIKE', `%${code}%`)
  }

  listDoctor(knex: Knex, limit: number = 100, offset: number = 1) {
    return knex('hospdata.lib_dr')
      .where('expire', '0000-00-00')
      .limit(limit)
      .offset(offset);
  }

  listDoctorByCode(knex: Knex, code: any, limit: number = 100,) {
    return knex('hospdata.lib_dr')
      .whereRaw("(concat('[', `code` ,']', ' ', `name`) LIKE ?)", `%${code}%`)
      .offset(1);
  }

  listTreatright(knex: Knex, limit: number = 100, offset: number = 0) {
    return knex('app_cahis.bd_treatright')
      .limit(limit)
      .offset(offset);
  }

  listPttype(knex: Knex, limit: number = 100, offset: number = 0) {
    return knex('lib_pttype')
      .where('isactive', 1)
      .limit(limit)
      .offset(offset);
  }

  listLibDischt(knex: Knex, limit: number = 100) {
    return knex('hospdata.lib_discht')
    .limit(limit)
  }

  listWard(db: Knex) {
    return db('hospdata.lib_ward as lib')
        .select('lib.*')
        .limit(1000);
    }
}
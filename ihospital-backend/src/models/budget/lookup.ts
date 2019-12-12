import Knex = require('knex');
import * as moment from 'moment';

export class LookupModel {

  public tableName = 'budget62.budget_personal';
  public primaryKey = 'ref';

  listBudgetType(knex: Knex, limit: number = 100, offset: number = 0) {
    return knex('budget62.lib_budget_type')
      .orderBy('ref')
      .limit(limit)
      .offset(offset);
  }
  listPosition(knex: Knex, limit: number = 100, offset: number = 0) {
    return knex('budget62.lib_position')
      .orderBy('ref')
      .limit(limit)
      .offset(offset);
  }
  listOt(knex: Knex, limit: number = 100, offset: number = 0) {
    return knex('budget62.lib_budget_ot')
      // .whereRaw('(item between "0103" and "0111") or item = "0117" ')
      .orderBy('item')
      .limit(limit)
      .offset(offset);
  }
  listGeneral(knex: Knex, limit: number = 100, offset: number = 0) {
    return knex('budget62.lib_budget_general')
      .orderBy('item')
      .limit(limit)
      .offset(offset);
  }
  libOperate(knex: Knex, limit: number = 100, offset: number = 0) {
    return knex('budget62.lib_budget_operate')
      .orderBy('item')
      .limit(limit)
      .offset(offset);
  }
  libOffice(knex: Knex, offset: number = 0) {
    return knex('budget62.lib_office')
      .whereRaw('isactive = 1 and budget_office=1')
      .orderBy('ref')
      .offset(offset);
  }
  libCom(knex: Knex, limit: number = 100, offset: number = 0) {
    return knex('budget62.lib_com')
      .orderBy('ref')
      .limit(limit)
      .offset(offset);
  }
  libMed(knex: Knex, limit: number = 100, offset: number = 0) {
    return knex('budget62.lib_med')
      .orderBy('ref')
      .limit(limit)
      .offset(offset);
  }
  libGen(knex: Knex, limit: number = 100, offset: number = 0) {
    return knex('budget62.lib_gen')
      .orderBy('ref')
      .limit(limit)
      .offset(offset);
  }
  libOth(knex: Knex, limit: number = 100, offset: number = 0) {
    return knex('budget62.lib_oth')
      .orderBy('ref')
      .limit(limit)
      .offset(offset);
  }
  libBuilding(knex: Knex, limit: number = 100, offset: number = 0) {
    return knex('budget62.lib_building')
      .orderBy('seq')
      .limit(limit)
      .offset(offset);
  }
  libStrategic(knex: Knex,limit: number = 100, offset: number = 0) {
    return knex('budget62.strategic')
      .orderBy('ref')
      .limit(limit)
      .offset(offset);
  }
  libKpi(knex: Knex, fiscal_year:number, limit: number = 100, offset: number = 0) {
    return knex('budget62.lib_kpi')
      .where('year',fiscal_year)
      .orderBy('ref')
      .limit(limit)
      .offset(offset);
  }
  libAdmin(knex: Knex, fiscal_year:number, limit: number = 100, offset: number = 0) {
    return knex('budget62.admin')
      .where('year',fiscal_year)
      .orderBy('ref')
      .limit(limit)
      .offset(offset);
  }

  libBudgetItem(knex: Knex, offset: number = 0) {
    return knex('budget62.view_budget_item')
      .orderBy('item')
      .offset(offset);
  }

  libBudgetItemSelect(knex: Knex, item: string, offset: number = 0) {
    return knex('budget62.view_budget_item')
      .whereRaw(`item like "${item}%"`)
      .orderBy('item')
      .offset(offset);
  }


  

  

}
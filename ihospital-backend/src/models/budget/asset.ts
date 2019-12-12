import Knex = require('knex');
import * as moment from 'moment';

export class AssetModel {

  public tableName = 'budget62.budget_fixasset';
  public primaryKey = 'ref';

  listCom(knex: Knex, department: string, fiscal_year:number, limit: number = 100, offset: number = 0) {
    return knex('budget62.view_budget_fixasset')
      .where({
        office: department,
        year: fiscal_year,
        typeasset: 'COM',
      })
      .orderBy('ref')
      .limit(limit)
      .offset(offset);
  }
  
  listMed(knex: Knex, department: string,fiscal_year:number, limit: number = 100, offset: number = 0) {
    return knex('budget62.view_budget_fixasset')
      .where({
        office: department,
        year: fiscal_year,
        typeasset: 'MED',
      })
      .orderBy('ref')
      .limit(limit)
      .offset(offset);
  }

  listGen(knex: Knex, department: string, fiscal_year: number, limit: number = 100, offset: number = 0) {
    return knex('budget62.view_budget_fixasset')
      .where({
        office: department,
        year: fiscal_year,
        typeasset: 'GEN',
      })
      .orderBy('ref')
      .limit(limit)
      .offset(offset);
  }
  listOth(knex: Knex, department: string,fiscal_year:number, limit: number = 100, offset: number = 0) {
    return knex('budget62.view_budget_fixasset')
    .where({
      office: department,
      year: fiscal_year,
      typeasset: 'OTH',
    })
      .orderBy('ref')
      .limit(limit)
      .offset(offset);
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

}
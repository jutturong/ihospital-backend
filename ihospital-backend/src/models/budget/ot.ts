import Knex = require('knex');
import * as moment from 'moment';

export class OtModel {

  public tableName = 'budget62.budget_job';
  public primaryKey = 'ref';

  list(knex: Knex,department: string, fiscal_year:number ,limit: number = 100, offset: number = 0) {
    return knex('budget62.view_budget_job')
      .where({
        office: department,
        year: fiscal_year,
      })
      .whereRaw('((item between "0103" and "0111") or item = "0117") ')
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
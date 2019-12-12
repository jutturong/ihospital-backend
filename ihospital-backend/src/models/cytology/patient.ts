import Knex = require('knex');
import * as moment from 'moment';

export class PatientModel {

  public tableName = 'app_cytology.patient_data';
  public primaryKey = 'ref';

  list(knex: Knex, limit: number = 100, offset: number = 0) {
    return knex(this.tableName)
      .limit(limit)
      .offset(offset);
  }

  listVn(knex: Knex,hn: string, limit: number = 10, offset: number = 0) {
    return knex(this.tableName)
      .where('hn',hn)
      .orderBy('visit_date','desc')
      .limit(limit)
      .offset(offset);
  }

  listRawdata(knex: Knex, limit: number = 100, offset: number = 0) {
    return knex.raw('');
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
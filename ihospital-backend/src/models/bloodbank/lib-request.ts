import Knex = require('knex');
import * as moment from 'moment';

export class LibRequestModel {

  public tableName = 'bloodbank_lib_request';
  public primaryKey = 'request_type_id';

  async list(knex: Knex, limit: number = 100, offset: number = 0) {
    return knex(this.tableName)
      .limit(limit)
      .offset(offset)
  }

  save(knex: Knex, datas: any) {
    return knex(this.tableName)
      .insert(datas);
  }

  update(knex: Knex, req_id: string, datas: any) {
    return knex(this.tableName)
      .where(this.primaryKey, req_id)
      .update(datas);
  }

  detail(knex: Knex, req_id: number) {
    return knex(this.tableName)
      .where(this.primaryKey, req_id);
  }


  remove(knex: Knex, req_id: string) {
    return knex(this.tableName)
      .where(this.primaryKey, req_id)
      .del();
  }

}
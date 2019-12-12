import Knex = require('knex');
import * as moment from 'moment';

export class TemplateAutoNumberModel {

  public tableName = 'template_autonumber';
  public primaryKey = 'id';

  list(knex: Knex, limit: number = 100, offset: number = 0) {
    return knex(this.tableName)
      .limit(limit)
      .offset(offset)
  }

  listById(knex: Knex, id = 1) {
    return knex(this.tableName)
      .where('id', id)
  }

  async getTemp(knex: Knex, listById) {
    this.listById(knex, listById).then((result: any) => {
      if (result.length > 0) { 
        return (result);
      }
    });
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
import Knex = require('knex');
import * as moment from 'moment';

export class TemplateAutoNumberGroupModel {

  public tableName = 'template_autonumber_group';
  public primaryKey = 'id';

  list(knex: Knex, limit: number = 100, offset: number = 0) {
    return knex(this.tableName)
      .limit(limit)
      .offset(offset)
  }

  listByTemp(knex: Knex, temp_id) {
    return knex(this.tableName)
      .where('template_fk', temp_id)
  }

  getCounter(knex: Knex, temp_id) {
    this.listByTemp(knex, temp_id);
    return knex(this.tableName);
  }

  save(knex: Knex, datas: any) {
    return knex(this.tableName)
      .insert(datas);
  }

  update(knex: Knex, req_id: string, data: any) {
    return knex(this.tableName)
      .where(this.primaryKey, req_id)
      .update(data);
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
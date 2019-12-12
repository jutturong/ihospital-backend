import Knex = require('knex');
import * as moment from 'moment';

export class InstrumentModel {

  public tableName = 'hospdata.lib_instrument_master';
  public tableDetail = 'hospdata.lib_instrument_detail';
  public primaryKey = 'instrument_id';
  public primaryKeyItem = 'ref';

  list(knex: Knex, offset: number = 0) {
    return knex(this.tableName)
      .offset(offset);
  }

  listItem(knex: Knex, instrument_id: number , pttype : string, offset: number = 0) {
    return knex(this.tableDetail)
      .where('instrument_id',instrument_id)
      .andWhere('pttype', pttype)
  }

  listByCode(knex: Knex, code: string, offset: number = 0) {
    return knex(this.tableName)
      .where('code', code)
      .offset(offset);
  }

  save(knex: Knex, datas: any) {
    return knex(this.tableName)
      .insert(datas);
  }

  saveItem(knex: Knex, datas: any) {
    return knex(this.tableDetail)
      .insert(datas);
  }

  update(knex: Knex, id: string, datas: any) {
    return knex(this.tableName)
      .where(this.primaryKey, id)
      .update(datas);
  }

  updateItem(knex: Knex, id: string, datas: any) {
    return knex(this.tableDetail)
      .where(this.primaryKeyItem, id)
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
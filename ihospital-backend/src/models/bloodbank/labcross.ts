import Knex = require('knex');
import * as moment from 'moment';

export class LabCrossModel {

  public tableName = 'bloodbank_lab_cross';
  public primaryKey = 'lab_cross_id';

  list(knex: Knex, limit: number = 100, offset: number = 0) {
    return knex(this.tableName)
      .offset(offset)
  }

  listByFk(knex: Knex, req_id: number) { 
    let concat = knex.raw("concat('[',t.code2,'] ', t.name) as fullname");
    return knex.select("r.*", 'c.lab_cross_id', 'c.unit', 'cross_time', 'c.cross_date', 't.code2', 't.group', 't.name', 't.code', 't.price', 't.abbr', 't.standard', concat)
      .from('bloodbank_lab_cross AS c')  
      .leftJoin('view_lab_test AS t', 'c.item_code', 't.code2')
      .leftJoin('bloodbank_request AS r', 'r.req_id', 'c.req_id')
      .where('c.req_id', req_id)
  }

  save(knex: Knex, datas: any) {
    return knex(this.tableName)
      .insert(datas)
      .returning('lab_cross_id');
  }

  update(knex: Knex, req_id: number, datas: any) {
    const firstData = datas[0] ? datas[0] : datas;
    return knex.raw(knex(this.tableName).insert(datas).toQuery() + " ON DUPLICATE KEY UPDATE " +
    Object.getOwnPropertyNames(firstData).map((field) => `${field}=VALUES(${field})`).join(", "));
  }

  updateAll(knex: Knex, req_id: number, datas: any) {
    const firstData = datas[0] ? datas[0] : datas;
    return knex.raw(knex(this.tableName).insert(datas).toQuery() + " ON DUPLICATE KEY UPDATE " +
    Object.getOwnPropertyNames(firstData).map((field) => `${field}=VALUES(${field})`).join(", "));
  }

  detail(knex: Knex, ref: number) {
    return knex(this.tableName)
      .where(this.primaryKey, ref);
  }

  remove(knex: Knex, id: number) {
    return knex(this.tableName)
      .where('lab_cross_id', id)
      .del()
  }
}
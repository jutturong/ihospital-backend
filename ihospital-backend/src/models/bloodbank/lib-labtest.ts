import Knex = require('knex');
import * as moment from 'moment';

export class LibLabtestModel {

  public tableName = 'view_lab_test';
  public primaryKey = 'code2';

  async list(knex: Knex, limit: number = 100, offset: number = 0) {
    let concat = knex.raw("concat('[',code2,'] ', name) as fullname");
    return knex(this.tableName)
      .column('code2', 'group', 'name', 'code', 'price', 'abbr', 'standard', concat)
      .limit(limit)
      .offset(offset)
  }

  async search(knex: Knex, q: string = "") {
    let concat = knex.raw("concat('[',code2,'] ', name) as fullname");
    return knex(this.tableName)
      .column('code2', 'group', 'name', 'code', 'price', 'abbr', 'standard', concat)
      .whereRaw("(concat('[',code2,'] ', name) LIKE ?)", `%${q}%` )
      .orderBy('name')
      
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

  defaultTest(knex: Knex, limit: number = 100, offset: number = 0) {
    let concat = knex.raw("concat('[',code2,'] ', name) as fullname");
    return knex(this.tableName)
      .column('code2', 'group', 'name', 'code', 'price', 'abbr', 'standard', concat)
      .whereIn('code2', ['22101', '22115', '22107',  '22108', '22104'])
      .offset(offset)
  }

  labTests(knex: Knex, req_id: number) { 
    let concat = knex.raw("concat('[',t.code2,'] ', t.name) as fullname");
    return knex.select("r.*", 'c.lab_cross_id', 'c.unit', 'cross_time', 'c.cross_date', 't.code2', 't.group', 't.name', 't.code', 't.price', 't.abbr', 't.standard', concat)
      .from('bloodbank_lab_cross AS c')  
      .leftJoin('view_lab_test AS t', 'c.item_code', 't.code2')
      .leftJoin('bloodbank_request AS r', 'r.req_id', 'c.req_id')
      .where('c.req_id', req_id)
  }
}

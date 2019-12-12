import Knex = require('knex');
import * as moment from 'moment';

export class LibDrModel {

  public tableName = 'employee';
  public primaryKey = 'code';

  async list(knex: Knex, limit: number = 100, offset: number = 0) {
    let concat = knex.raw("concat('[',id,'] ', name, ' ', surname) as drfull");
    return knex(this.tableName)
      .column('code', 'no', 'id', 'name', 'surname', 'title', concat)
      .where('position', 'นายแพทย์')
      .andWhere('expire', '0000-00-00')
      .orWhere('expire', '')
      .orderBy('name')
      .limit(limit)
      .offset(offset)
  }

  search(knex: Knex, q: string = "") {
    let concat = knex.raw("concat('[',id,'] ', name, ' ', surname) as drfull");
    return knex(this.tableName)
      .column('code', 'no', 'id', 'name', 'surname', 'title', concat)
      .where('position', 'นายแพทย์')
      .where('expire', '0000-00-00')
      .orWhere('expire', '')
      .whereRaw("(concat('[',id,']', name, ' ', surname) LIKE ?)", `%${q}%` )
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

}
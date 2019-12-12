import Knex = require('knex');
import * as moment from 'moment';

export class LibEmpModel {

  public tableName = 'employee';
  public primaryKey = 'code';

  async list(knex: Knex, limit: number = 100, offset: number = 0) {
    let concat = knex.raw("concat('[',id,'] ', name, ' ', surname) as empfull");
    return knex(this.tableName)
      .column('code', 'no', 'id', 'name', 'surname', 'title', concat)
      .whereNot('code', '')
      .where('position', 'พยาบาลวิชาชีพ')
      .where('expire', '0000-00-00')
      .orWhere('expire', '')
      .orWhereNull('expire')
      .orderBy('name')
      .limit(limit)
      .offset(offset)
  }

  async search(knex: Knex, q: string = "") {
    let concat = knex.raw("concat('[', code, '] ', name, ' ', surname) as emp_name");
    let emp_fullname = knex.raw("concat(title, name, ' ', surname) as emp_fullname");
    return knex(this.tableName)
      .column('code', 'no', 'id', 'name', 'surname', 'title', concat, emp_fullname)
      .whereNot('code', '')
      .where('expire', '0000-00-00')
      .orWhere('expire', '')
      .orWhereNull('expire')
      .whereRaw("(concat('[',id,']', name, ' ', surname) LIKE ?)", `%${q}%` )
      .orderBy('name')
  }

  async searchDoc(knex: Knex, q: string = "") {
    let concat = knex.raw("concat('[',id,'] ', name, ' ', surname) as dr_name");
    return knex(this.tableName)
      .column('code', 'no', 'id', 'name', 'surname', 'title', concat)
      .whereNot('code', '')
      .where('position', 'นายแพทย์')
      .where('expire', '0000-00-00')
      .orWhere('expire', '')
      .orWhereNull('expire')
      .whereRaw("(concat('[',id,']', name, ' ', surname) LIKE ?)", `%${q}%` )
      .orderBy('name')
  }

  async searchCollected(knex: Knex, q: string = "") {
    let concat = knex.raw("concat('[',id,'] ', name, ' ', surname) as collected_name");
    return knex(this.tableName)
      .column('code', 'no', 'id', 'name', 'surname', 'title', concat)
      .whereNot('code', '')
      .where('position', 'พยาบาลวิชาชีพ')
      .where('expire', '0000-00-00')
      .orWhere('expire', '')
      .orWhereNull('expire')
      .whereRaw("(concat('[',id,']', name, ' ', surname) LIKE ?)", `%${q}%` )
      .orderBy('name')
  }

  async searchVerify(knex: Knex, q: string = "") {
    let concat = knex.raw("concat('[',id,'] ', name, ' ', surname) as verify_name");
    return knex(this.tableName)
      .column('code', 'no', 'id', 'name', 'surname', 'title', concat)
      .whereNot('code', '')
      .where('position', 'พยาบาลวิชาชีพ')
      .where('expire', '0000-00-00')
      .orWhere('expire', '')
      .orWhereNull('expire')
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
import Knex = require('knex');
import * as moment from 'moment';

export class GroupingModel {

  public tableName = 'bloodbank_grouping';
  public primaryKey = 'grouping_id';

  list(knex: Knex, limit: number = 100, offset: number = 0) {
    return knex(this.tableName)
      .offset(offset)
  }

  save(knex: Knex, datas: any) {
    return knex(this.tableName)
      .insert(datas);
  }

  bloodCard(knex: Knex, req_id: number) {
    return knex.select('r.req_id, r.hn, r.an, i.title, i.name, i.surname, i.ward, i.ward_name, i.birth, g.abo_type, c.unit_no, lc.name AS lab_code_name, lc.price')
      .from('bloodbank_request r')
      .leftJoin('view_ipd_ipd i', 'r.an', 'i.an')
      .leftJoin('bloodbank_grouping g', 'r.req_id', 'g.req_id')
      .leftJoin('bloodbank_crossmatch c', 'r.req_id', 'c.req_id')
      .leftJoin('bloodbank_lab_cross l', 'r.req_id', 'l.req_id')
      .leftJoin('lab_code lc', 'l.item_code', 'lc.code2')
      .where('r.req_id', req_id);
  }

  update(knex: Knex, grouping_id: number, datas: any) {
    return knex(this.tableName)
      .where('grouping_id', grouping_id)
      .update(datas);
  }

  detail(knex: Knex, req_id: number) {
    return knex(this.tableName)
      .where('req_id', req_id)
      .groupBy('req_id')
      .orderBy('grouping_id', 'DESC');
  }

  remove(knex: Knex, id: number) {
    return knex(this.tableName)
      .where('id', id)
      .del();
  }
}
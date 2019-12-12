import Knex = require('knex');
export class SpecimenModel {

  public tableName = 'bloodbank_specimen';
  public primaryKey = 'specimen_id';

  list(knex: Knex, limit: number = 100, offset: number = 0) {
    return knex(this.tableName)
      .offset(offset)
  }

  save(knex: Knex, datas: any) {
    return knex(this.tableName)
      .insert(datas);
  }

  update(knex: Knex, id: number, datas: any) {
    return knex(this.tableName)
      .where(this.primaryKey, id)
      .update(datas);
  }

  view(knex: Knex, ref: number) {
    return knex(this.tableName)
      .where('req_id', ref)
      .limit(1);
  }

  remove(knex: Knex, id: number) {
    return knex(this.tableName)
      .where('id', id)
      .del();
  }
}
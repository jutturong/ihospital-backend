import Knex = require('knex');
import * as moment from 'moment';

export class ApproveModel {

  public tableName = 'budget62.budget_approve';
  public primaryKey = 'ref';

  list(knex: Knex, ref:number, type:string, offset: number = 0) {
    let sql = `
    select * from budget62.budget_approve
    where ref = ${ref} and type = '${type}' 
    and id in (select max(id) from budget62.budget_approve where ref = ${ref} and type = '${type}' )
    order by date desc
    `
    return knex.raw(sql);
  }

  save(knex: Knex, datas: any) {
    return knex(this.tableName)
      .insert(datas);
  }

  saveProject(knex: Knex, datas: any) {
    return knex('budget62.budget_project_approve')
      .insert(datas);
  }

  update(knex: Knex, id: string, datas: any) {
    return knex(this.tableName)
      .where(this.primaryKey, id)
      .update(datas);
  }

  updateGeneral(knex: Knex, id: string, datas: any) {
    return knex('budget62.budget_job')
      .where('ref', id)
      .update(datas);
  }

  updateFixasset(knex: Knex, id: string, datas: any) {
    return knex('budget62.budget_fixasset')
      .where('ref', id)
      .update(datas);
  }

  updateBuilding(knex: Knex, id: string, datas: any) {
    return knex('budget62.budget_buildingrepair')
      .where('ref', id)
      .update(datas);
  }
  updatePersonal(knex: Knex, id: string, datas: any) {
    return knex('budget62.budget_personal')
      .where('ref', id)
      .update(datas);
  }

  updateProject(knex: Knex, id: string, datas: any) {
    return knex('budget62.budget_project')
      .where('ref', id)
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
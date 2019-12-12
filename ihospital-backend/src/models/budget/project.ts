import Knex = require('knex');
import * as moment from 'moment';

export class ProjectModel {

  public tableName = 'budget62.budget_project';
  public primaryKey = 'ref';

  list(knex: Knex, department: string,fiscal_year:number, limit: number = 100, offset: number = 0) {
    return knex('budget62.view_budget_project')
      .where({
        office: department,
        year: fiscal_year,
      })
      .orderBy('ref')
      .limit(limit)
      .offset(offset);
  }

  listItemByProject(knex: Knex, project_id: number, fiscal_year:number, limit: number = 100, offset: number = 0) {
    return knex('budget62.budget_project_item')
      .where({
        ref: project_id,
        year: fiscal_year,
      })
      .orderBy('seq')
      .limit(limit)
      .offset(offset);
  }

  listItem(knex: Knex, fiscal_year:number, limit: number = 100, offset: number = 0) {
    return knex('budget62.budget_project_item')
      .where({
        year: fiscal_year,
      })
      .orderBy('seq')
      .limit(limit)
      .offset(offset);
  }

  saveItem(knex: Knex, datas: any) {
    return knex('budget62.budget_project_item')
      .insert(datas);
  }

  updateItem(knex: Knex, id: string, datas: any) {
    return knex('budget62.budget_project_item')
      .where('seq', id)
      .update(datas);
  }

  detailItem(knex: Knex, id: string) {
    return knex('budget62.budget_project_item')
      .where(this.primaryKey, id);
  }

  save(knex: Knex, datas: any) {
    return knex(this.tableName)
      .insert(datas);
  }

  update(knex: Knex, id: string, datas: any) {
    return knex(this.tableName)
      .where(this.primaryKey, id)
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
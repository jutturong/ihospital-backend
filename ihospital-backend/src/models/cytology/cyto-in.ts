import Knex = require('knex');
import * as moment from 'moment';

export class CytoInModel {

  public tableName = 'app_cytology.cyto_in';
  public primaryKey = 'ref';

  list(knex: Knex, limit: number = 100, offset: number = 0) {
    return knex
      .select('app_cytology.cyto_in.*'
      ,'app_cytology.lib_cyto_type.name as cyto_name'
      ,'app_cytology.adeqs.name as adeq_name'
      ,'app_cytology.acause.name as cause_name'
      ,'app_cytology.r1.result as r1_name'
      ,'app_cytology.r2.result as r2_name'
      ,'app_cytology.r3.result as r3_name'
      ,'app_cytology.r4.result as r4_name'
      )
      .from(this.tableName)
      .leftJoin('app_cytology.lib_cyto_type','cyto_type','lib_cyto_type.code')
      .leftJoin('app_cytology.lib_adequacy_specimen as adeqs','adequacy','adeqs.code')
      .leftJoin('app_cytology.lib_adequacy as acause','cause','acause.code')
      .leftJoin('app_cytology.lib_result as r1','result1','r1.code')
      .leftJoin('app_cytology.lib_result as r2','result2','r2.code')
      .leftJoin('app_cytology.lib_result as r3','result3','r3.code')
      .leftJoin('app_cytology.lib_result as r4','result4','r4.code')
      .orderBy('app_cytology.cyto_in.ref','desc')
      .limit(limit)
      .offset(offset);
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
import Knex = require('knex');
import * as moment from 'moment';

export class OrganModel {

  public tableName  = 'hospdata.organdonate';
  public primaryKey = 'id';

  list(knex: Knex,q='',filterby = 'hn', limit = 1000, offset = 0) {
    let query = knex(this.tableName)
      //.whereRaw('kpi_year >= 2560')
      .orderBy('id','DESC')
      .limit(limit)
      .offset(offset);
      if(q==''){
        return query;
      }
      if(filterby == 'hn'){
        return query.where({
          hn : q
        });
      } else {
        
        return query.where('name','like','%' + q + '%')
        .orWhere('surname','like','%' + q + '%');
      }
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
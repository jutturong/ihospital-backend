import Knex = require('knex');
import * as moment from 'moment';

// export class DonateModel {

  export class UsertimelogModel {

  public tableName  = 'app_time.usertimelog';
  public primaryKey = 'id_usertimelog';

  list(knex: Knex,q='',filterby = 'id_user', limit = 1000, offset = 0) {
    let query = knex(this.tableName)
      //.whereRaw('kpi_year >= 2560')
      .orderBy('id_usertimelog','DESC')
      .limit(limit)
      .offset(offset);
      if(q==''){
        return query;
      }
      if(filterby == 'id_usertimelog'){
        return query.where({
          id_user : q
        });
      } else {
        
        return query.where('id_user','like','%' + q + '%')
        .orWhere('id_user','like','%' + q + '%');
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
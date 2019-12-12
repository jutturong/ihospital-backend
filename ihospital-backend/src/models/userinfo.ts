import Knex = require('knex');
import * as moment from 'moment';

// export class DonateModel {

  export class UserinfoModel {

  public tableName  = 'app_time.userinfo';
  public primaryKey = 'SSN';

  list(knex: Knex,q='',filterby = 'SSN', limit = 1000, offset = 0) {
    let query = knex(this.tableName)
      //.whereRaw('kpi_year >= 2560')
      .orderBy('SSN','DESC')
      .limit(limit)
      .offset(offset);
      if(q==''){
        return query;
      }
      if(filterby == 'SSN'){
        return query.where({
          ssn : q
        });
      } else {
        
        return query.where('SSN','like','%' + q + '%')
        .orWhere('SSN','like','%' + q + '%');
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
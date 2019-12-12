import Knex = require('knex');
import * as moment from 'moment';

// export class DonateModel {

  export class HiptimeModel {

  public tableName  = 'app_time.userinfo';
  public primaryKey = 'USERID';

  list(knex: Knex,q='',filterby = 'Badgenumber', limit = 100, offset = 0) {
    let query = knex(this.tableName)
      //.whereRaw('kpi_year >= 2560')
      .orderBy('USERID','DESC')
      .limit(limit)
      .offset(offset);
      if(q==''){
        return query;
      }


      if(filterby == 'SSN'){
        return query.where({
          hn : q
        });
      } else {
        
         return query.where('Badgenumber','like','%' + q + '%')
       
         .orWhere('Badgenumber','like','%' + q + '%');
      }
  }




  /*
  update(knex: Knex, id: string, datas: any) {
    return knex(this.tableName)
      .where(this.primaryKey, id)
      .update(datas);
  }
*/


  
  detail(knex: Knex, id: string) {
    return knex(this.tableName)
       .where('SSN', 'ร0089');
  }

  /*
  save(knex: Knex, datas: any) {
    return knex(this.tableName)
      .insert(datas);
  }
  */



}
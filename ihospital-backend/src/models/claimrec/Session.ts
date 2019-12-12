import Knex = require('knex');
import * as moment from 'moment';

export class SessionModel {

  public tableName  = 'claimrec.sessions';
  public primaryKey = 'id';

  list(knex: Knex,q='',filterby = 'date', limit = 1000, offset = 0) {
    let query = knex(this.tableName)
      //.whereRaw('kpi_year >= 2560')
      .orderBy('id','DESC')
      .limit(limit)
      .offset(offset);
      if(q==''){
        return query;
      }
      if(filterby == 'date'){
        return query.where({
            session_date : q
        });
      }else if(filterby == 'hcode'){
        return query.where({
            session_date : q
        });
      }else if(filterby == 'hname'){
        return query.where('hname','like','%' + q + '%');
      } else {
        return query;
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
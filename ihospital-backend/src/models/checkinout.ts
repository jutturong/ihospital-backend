import Knex = require('knex');
import * as moment from 'moment';

// export class DonateModel {

  export class CheckinoutModel {

  public tableName  = 'app_time.checkinout';
  public primaryKey = 'id';
  public Badgenumber ='Badgenumber';
  public CHECKTIME='CHECKTIME';


  list(knex: Knex,q='',filterby = 'id', limit = 1000, offset = 0) {
    let query = knex(this.tableName)
      //.whereRaw('kpi_year >= 2560')
      .orderBy('id','DESC')
      .limit(limit)
      .offset(offset);
      if(q==''){
        return query;
      }
      if(filterby == 'id'){
        return query.where({
            Badgenumber : q
        });
      } else {
        
        return query.where('Badgenumber','like','%' + q + '%')
        .orWhere('Badgenumber','like','%' + q + '%');
      }
  }

  querybadgenumber(knex: Knex, Badgenumber: string){
      return knex(this.tableName    )
      .where(this.Badgenumber,Badgenumber)
      .orderBy(this.primaryKey,'DESC')
      .limit(7);

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

  getFormID(knex: Knex, id: string){
    return knex(this.tableName)
    .where(this.primaryKey, id)
  }
  



}
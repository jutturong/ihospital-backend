import Knex = require('knex');
import * as moment from 'moment';

export class NmisKpiModel {

    public tableNameData = 'intranet.kpi_nurse_data';
    public tableNameViewData = 'intranet.view_kpi_nurse_data';
    public tableNameViewKardex = 'intranet.view_kpi_nurse_kardex';
    public tableNameKardex = 'intranet.kpi_nurse_kardex';
    public primaryKey = 'ref';

    listWard(knex: Knex, offset: number = 0) {
      return knex('hospdata.lib_ward')
        .whereRaw('code not in(0,16,30,28,99)')
        .orderBy('code');
    }
    
    listData(knex: Knex, offset: number = 0) {
      return knex(this.tableNameViewData)
        .offset(offset)
        .orderBy('ref','desc');
    }

    listDataByWard(knex: Knex,office: string, month: number, year:number, limit: number = 1) {
      return knex(this.tableNameViewData)
        .where({
          office: office,
          month: month,
          year: year
        })
        .limit(limit);
    }

    listDataByDate(knex: Knex, month: number, year:number) {
      return knex(this.tableNameViewData)
        .where({
          month: month,
          year: year
        });
    }

    listAllDataByYear(knex: Knex, office: string, start: string, end: string) {
      return knex(this.tableNameViewData)
      .whereRaw(`office = ?
      and CONCAT(month,year) between ? and ?`,[office,start,end])
      .orderByRaw('year,month asc');
    }

    listAllKardexByYear(knex: Knex, office: string, start: string, end: string) {
      return knex(this.tableNameViewKardex)
      .whereRaw(`office = ?
      and CONCAT(month,year) between ? and ?`,[office,start,end])
      .orderByRaw('year,month asc');
    }

    listViewData(knex: Knex, offset: number = 0) {
      return knex(this.tableNameViewData)
        .offset(offset);
    }

    listKardex(knex: Knex, offset: number = 0) {
      return knex(this.tableNameViewKardex)
        .offset(offset)
        .orderBy('ref','desc');
    }

    listViewKardex(knex: Knex, offset: number = 0) {
      return knex(this.tableNameKardex)
        .offset(offset);
    }

    listKardexByWard(knex: Knex,office: string, month: number, year:number, limit: number = 1) {
      return knex(this.tableNameViewKardex)
        .where({
          office: office,
          month: month,
          year: year
        })
        .limit(limit);
    }

    listKardexByDate(knex: Knex, month: number, year:number) {
      return knex(this.tableNameViewKardex)
        .where({
          month: month,
          year: year
        });
    }
    
    saveData(knex: Knex, datas: any) {
      return knex(this.tableNameData)
        .insert(datas);
    }
  
    saveKardex(knex: Knex, datas: any) {
      return knex(this.tableNameKardex)
        .insert(datas);
    }

    removeData(knex: Knex, id: string) {
      return knex(this.tableNameData)
        .where(this.primaryKey, id)
        .del();
    }

    removeKardex(knex: Knex, id: string) {
      return knex(this.tableNameKardex)
        .where(this.primaryKey, id)
        .del();
    }


    updateData(knex: Knex, id: string, datas: any) {
      return knex(this.tableNameData)
        .where(this.primaryKey, id)
        .update(datas);
    }

    updateKardex(knex: Knex, id: string, datas: any) {
      return knex(this.tableNameKardex)
        .where(this.primaryKey, id)
        .update(datas);
    }

    listWardNodata(knex: Knex,month: number, year: number, offset: number = 0) {
      return knex
        .select(knex.raw(
        `code,ward,abbr`
      ))
        .from('hospdata.lib_ward')
        .whereRaw(`(code not in 
        (select DISTINCT office 
          from intranet.kpi_nurse_data 
          where month=? and year=?) and code not in(0,16,30,28,99)) `,[month,year])
        .orderBy('code')
        .offset(offset);
    }

    listWardNokardex(knex: Knex,month: number, year: number, offset: number = 0) {
      return knex
        .select(knex.raw(
        `code,ward,abbr`
      ))
        .from('hospdata.lib_ward')
        .whereRaw(`(code not in 
        (select DISTINCT office 
          from intranet.kpi_nurse_kardex
          where month=? and year=?) and code not in(0,16,30,28,99))`,[month,year])
        .orderBy('code')
        .offset(offset);
    }
}  
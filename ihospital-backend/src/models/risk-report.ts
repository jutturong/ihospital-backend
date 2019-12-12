import Knex = require('knex');
import * as moment from 'moment';

export class RiskreportModel {

    public tableName = 'risk.risk';
    
    list(knex: Knex, limit: number = 100, offset: number = 0) {
        return knex(this.tableName)
          .orderBy('seq','desc')
          .limit(limit)
          .offset(offset);
      }

    amountBymonthClinic(knex: Knex,startdate: string, enddate: string, limit: number = 100, offset: number = 0) {
        return knex
          .select(knex.raw(
          `month(date_incident) as date_month
          ,year(date_incident) as date_year
          ,sum(if(sentinel=0,1,0)) as sen_no
          ,sum(if(sentinel=1,1,0)) as sen_yes
          ,sum(if(level_a =1,1,0)) as a
          ,sum(if(level_a =2,1,0)) as b
          ,sum(if(level_a =3,1,0)) as c
          ,sum(if(level_a =4,1,0)) as d
          ,sum(if(level_a =5,1,0)) as e
          ,sum(if(level_a =6,1,0)) as f
          ,sum(if(level_a =7,1,0)) as g
          ,sum(if(level_a =8,1,0)) as h
          ,sum(if(level_a =9,1,0)) as i
          ,sum(if(level_a <1 or level_a>9,1,0)) as na
          ,count(level_a) as total`
        ))
          .from(this.tableName)
          .whereRaw('(cancel_date is NULL or cancel_date = "0000-00-00 00:00:00") and typeclinic=1 ')
          .whereBetween('date_incident', [startdate, enddate])
          .groupByRaw('month(date_incident),year(date_incident)')
          .orderByRaw('year(date_incident),month(date_incident)')
          .limit(limit)
          .offset(offset);
      }


      amountBymonthNonclinic(knex: Knex,startdate: string, enddate: string, limit: number = 100, offset: number = 0) {
        return knex
          .select(knex.raw(
          `month(date_incident) as date_month
          ,year(date_incident) as date_year
          ,sum(if(sentinel=0,1,0)) as sen_no
          ,sum(if(sentinel=1,1,0)) as sen_yes
          ,sum(if(nonclinic_level =1,1,0)) as n1
          ,sum(if(nonclinic_level =2,1,0)) as n2
          ,sum(if(nonclinic_level =3,1,0)) as n3
          ,sum(if(nonclinic_level =4,1,0)) as n4
          ,sum(if(nonclinic_level <1 or nonclinic_level>4,1,0)) as na
          ,count(nonclinic_level) as total`
        ))
          .from(this.tableName)
          .whereRaw('(cancel_date is NULL or cancel_date = "0000-00-00 00:00:00") and typeclinic = 2')
          .whereBetween('date_incident', [startdate, enddate])
          .groupByRaw('month(date_incident),year(date_incident)')
          .orderByRaw('year(date_incident),month(date_incident)')
          .limit(limit)
          .offset(offset);
      }


      amountByOfficeClinic(knex: Knex,startdate: string, enddate: string, offset: number = 0) {
        return knex
          .select(knex.raw(
          `risk.department
          ,lib_office.name
          ,sum(if(sentinel=0,1,0)) as sen_no
          ,sum(if(sentinel=1,1,0)) as sen_yes
          ,sum(if(level_a =1,1,0)) as a
          ,sum(if(level_a =2,1,0)) as b
          ,sum(if(level_a =3,1,0)) as c
          ,sum(if(level_a =4,1,0)) as d
          ,sum(if(level_a =5,1,0)) as e
          ,sum(if(level_a =6,1,0)) as f
          ,sum(if(level_a =7,1,0)) as g
          ,sum(if(level_a =8,1,0)) as h
          ,sum(if(level_a =9,1,0)) as i
          ,sum(if(level_a <1 or level_a>9,1,0)) as na
          ,count(level_a) as total`
        ))
          .from(this.tableName)
          .leftJoin('lib_office', 'risk.department', 'lib_office.ref')
          .whereRaw('(risk.cancel_date is NULL or risk.cancel_date = "0000-00-00 00:00:00") and risk.typeclinic = 1')
          .whereBetween('risk.date_incident', [startdate, enddate])
          .groupByRaw('risk.department')
          .orderByRaw('total desc,department')
          .offset(offset);
      }


      amountByOfficeNonclinic(knex: Knex,startdate: string, enddate: string, offset: number = 0) {
        return knex
          .select(knex.raw(
          `risk.department
          ,lib_office.name
          ,sum(if(risk.sentinel=0,1,0)) as sen_no
          ,sum(if(risk.sentinel=1,1,0)) as sen_yes
          ,sum(if(risk.nonclinic_level =1,1,0)) as n1
          ,sum(if(risk.nonclinic_level =2,1,0)) as n2
          ,sum(if(risk.nonclinic_level =3,1,0)) as n3
          ,sum(if(risk.nonclinic_level =4,1,0)) as n4
          ,sum(if(risk.nonclinic_level <1 or risk.nonclinic_level>4,1,0)) as na
          ,count(risk.nonclinic_level) as total`
        ))
          .from(this.tableName)
          .leftJoin('lib_office', 'risk.department', 'lib_office.ref')
          .whereRaw('(risk.cancel_date is NULL or risk.cancel_date = "0000-00-00 00:00:00") and risk.typeclinic = 2')
          .whereBetween('risk.date_incident', [startdate, enddate])
          .groupByRaw('risk.department')
          .orderByRaw('total desc,department')
          .offset(offset);
      }


}  
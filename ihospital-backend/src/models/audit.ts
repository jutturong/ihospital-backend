import Knex = require('knex');
import * as moment from 'moment';

export class AuditModel {
    sumMonthlyAll(knex: Knex, typedate, date1, date2) {
        const sql = `SELECT substr(a.${typedate},1,7) as monthly, count(1) as cases
            FROM audit_ipd54 as a
            WHERE a.${typedate} BETWEEN "${date1}" and "${date2} 23:59:59"
            GROUP BY monthly`;
        return knex.raw(sql);
    }

}  
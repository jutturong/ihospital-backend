import Knex = require('knex');
import * as moment from 'moment';

export class PharmacyModel {
    getOpdDrugs(knex: Knex, hn) {
        return knex.select('*')
            .from('view_pharmacy_opd_drug_item')
            .where('hn', '=', hn)
            .orderBy('date', 'desc')
            .orderBy('vn', 'desc')
            .limit(2500);
    }

    getOpdDrugbyvn(knex: Knex, vn) {
        return knex.select('*')
            .from('view_pharmacy_opd_drug_item')
            .where('vn', '=', vn)
            .limit(2500);
    }

    getOpdDrug(knex: Knex, codePay) {
        return knex.select('*')
            .from('view_pharmacy_opd_drug_item')
            .where('code_pay', '=', codePay)
            .limit(2500);
    }

    selectSql(knex: Knex, tableName: string, selectText: string, whereText: string, groupBy: string, orderBy: string) {
        let sql = 'select ' + selectText + ' from ' + tableName;
        if (whereText != '') {
            sql = sql + ' where ' + whereText;
        }
        if (groupBy != '') {
            sql = sql + ' group by ' + groupBy;
        }
        if (orderBy != '') {
            sql = sql + ' order by ' + orderBy;
        }
        sql = sql + ' limit 0,5000';
        return knex.raw(sql);
    }

}  
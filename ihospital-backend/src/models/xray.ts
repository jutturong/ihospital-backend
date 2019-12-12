import Knex = require('knex');
import * as moment from 'moment';

export class XrayModel {
    getXray(knex: Knex, columnName, textSearch) {
        return knex.select('*')
            .from('view_xray_request_item')
            .where(columnName, '=', textSearch)
            .orderBy('date', 'desc')
            .limit(5000);
    }

}  
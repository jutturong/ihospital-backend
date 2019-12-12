import Knex = require('knex');
import * as moment from 'moment';

export class AncModel {
    getAncScreening(knex : Knex, hn, gravida=0) {
        let where = { hn: hn };
        if (gravida > 0) {
            where['gravida'] = gravida;
        }
        return knex
            .select('anc_screening.*')
            .from('anc.anc_screening')
            .where(where);
    }

    saveAncScreening(knex : Knex, screenId = 0, arrData) {
        if (screenId === 0) {
            return knex('anc.anc_screening')
                .insert(arrData)
                .returning('screen_id');
        } else {
            return knex('anc.anc_screening')
                .update(arrData)
                .where('screen_id', '=', screenId)
                .returning('screen_id');
        }

    }

    saveData(knex : Knex, tableName = '', columnPK = '', textSearch, dataArray) {
        if (tableName === '' || columnPK === '' || !dataArray) {
            return null;
        }
        if (columnPK !== '' && textSearch !== '' && textSearch !== '0') {
            return knex(tableName)
                .update(dataArray)
                .where(columnPK, '=', textSearch)
                .returning(columnPK);
        } else {
            return knex(tableName)
                .insert(dataArray)
                .returning(columnPK);
        }
    }

    deleteAncScreening(knex : Knex, screenId = 0) {
        if (screenId > 0) {
            return knex
                .del('anc.anc_screening')
                .where('screen_id', '=', screenId)
                .returning('screen_id');
        } else {
            return null;
        }
    }

}
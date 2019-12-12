import Knex = require('knex');
import * as moment from 'moment';

export class InspectionModel {
    getData(knex: Knex, tableName='', columnName = '', textSearch, limit=2500) {
        if (tableName === '') {
            return null;
        }
        if (columnName === '' || textSearch === '') {
            return knex(tableName).select('*').limit(limit);
        } else {
            return knex(tableName).select('*')
                .where(columnName, '=', textSearch)
                .limit(limit);
        }
    }

    getDataByMonth(knex: Knex, textSearch, limit = 2500) {
        const month = textSearch.substr(0, 7);
        const sql = `SELECT data.*, e.title, e.name, e.surname, e.position ` +
            `FROM intranet.inspection_data as data `+
            `LEFT JOIN intranet.employee as e on data.uid = e.code `+
            `WHERE substr(data.date,1,7)="${month}" `+
            `Limit ${+limit}`;
        return knex.raw(sql);
        //return knex('intranet.inspection_data').select('*')
        //    .where('substr(date,1,7)', '=', textSearch)
        //    .limit(limit);
    }

    saveData(knex: Knex, tableName='', columnPK = '', textSearch, dataArray) {
        if (tableName === '' || columnPK === '' || !dataArray) {
            return null;
        }
        if (columnPK !== '' && textSearch !== '' && textSearch !== 0) {
            return knex(tableName).update(dataArray)
                .where(columnPK, '=', textSearch)
                .returning(columnPK);
        } else {
            return knex(tableName).insert(dataArray)
                .returning(columnPK);
        }
    }

    deleteData(knex: Knex, tableName='', columnName = '', textSearch) {
        if (tableName === '' || columnName === '' || textSearch === '' || textSearch === 0) {
            return null;
        }
        return knex(tableName).delete()
            .where(columnName, '=', textSearch)
            .limit(1);
    }


}  
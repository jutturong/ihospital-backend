// Model กรณีที่ยังไม่จัดหมวดงาน หรือ เป็น models กลาง

import Knex = require('knex');
import * as moment from 'moment';

export class MainModel {

    getOffice(knex: Knex, columnName = '', searchText = '') {
        if (columnName === '' || searchText === '') {
            return knex('hospdata.lib_office_budget')
                .select('*')
                .orderBy('ref')
                .limit(500);
        } else {
            return knex('hospdata.lib_office_budget')
                .select('*')
                .where(columnName, 'like', `%${searchText}%`)
                .orderBy('ref')
                .limit(500);
        }
    }

    getHoliday(knex: Knex, dateStart, dateEnd) {
        return knex('intranet.holiday')
            .select('*')
            .where('gov_holiday', 1)
            .whereBetween('date', [dateStart, dateEnd])
            .orderBy('date')
            .limit(100);
    }

    getBuilding(knex: Knex) {
        return knex('intranet.lib_building')
            .select('*')
            .orderBy('name')
            .limit(500);
    }

    getBuildingBySearch(knex: Knex, columnName, searchText) {
        if (columnName === '' || searchText === '') {
            return null;
        }
        return knex('intranet.lib_building')
            .select('*')
            .where(columnName, 'like', `%${searchText}%`)
            .orderBy('name')
            .limit(500);
    }

    getInternalPhone(db: Knex, columnName, searchText) {
        let where = '';
        console.log(columnName, searchText);
        if (columnName && searchText) {
            where = 'p.' + columnName + ` like "${searchText}%"`;
        } else {
            where = 'p.no!=""';
        }

        console.log('where', where);
        return db('intranet.phone_internal as p')
            .leftJoin('hospdata.lib_office_budget as o', 'p.department', 'o.ref')
            .select('p.*', 'o.name as department_name')
            .whereRaw(where)
            .orderBy('p.no')
            .limit(2000);
    }

    saveInternalPhone(knex: Knex, phoneNo, data) {
        if (phoneNo === '') {
            return knex('intranet.phone_internal')
                .insert(data)
                .returning(['no']);
        } else {
            return knex('intranet.phone_internal')
                .update(data)
                .where('no', phoneNo)
                .returning(['no']);
        }
    }


}  
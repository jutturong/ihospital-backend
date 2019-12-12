import Knex = require('knex');
import * as moment from 'moment';

export class TimeAttendanceModel {

    saveTimeAttd(knex: Knex, data, ref = 0) {
        if (ref > 0) {
            return knex('time_in.time_attendance')
                .update(data)
                .where('ref', ref)
                .returning(['ref', 'uid', 'date_in', 'date_out']);
        } else {
            return knex('time_in.time_attendance')
                .insert(data)
                .returning(['ref', 'uid', 'date_in', 'date_out']);

        }
    }

    getTimeAttd(knex: Knex, where = {}) {
        if (!where) {
            return null;
        }
        return knex('time_in.time_attendance')
            .where(where)
            .limit(100);
    }
}  
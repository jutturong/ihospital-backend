import Knex = require('knex');
import * as moment from 'moment';

export class LabModel {
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

    async getLabMonitoringByDate(db: Knex, date, limit = 2500) {
        const sql = `SELECT m.monitor_id, m.result_ref, m.lab_ref, 
                request.hn, request.vn, request.an, request.title, request.name, request.surname,
                ipd.ward, ipd.ward_name, ipd.dr, ipd.dr_name,
                result.lab_no, result.lab_code, result.lab_name, result.result, 
                result.type_result, result.unit, result.minresult, result.maxresult, 
                m.result_text, m.monitoring, m.alert,
                m.timing, m.infect_type,
                concat(request.date,' ',request.time) as date_request, request.date_input,
                substr(date_result,1,10) as dateresult , result.date_result, 
                concat(opd.date,' ',opd.time_in) as date_visit, 
                concat(opd.date,' ',opd.time_opd) as date_opd,
                concat(opd.date,' ',opd.time_cln) as date_clinic,
                concat(opd.date,' ',opd.time_dr) as date_dr,
                concat(ipd.admite,' ',ipd.time) as date_admit, 
                concat(ipd.disc,' ',ipd.timedisc) as date_disc,
                m.review, m.remark, m.completed,
                m.last_update
            FROM lab.lab_monitoring as m
                LEFT JOIN lab.result_rax as result on m.result_ref = result.ref
                LEFT JOIN lab.request on result.lab_no = request.lab_no 
                LEFT JOIN hospdata.opd_visit as opd on request.vn = opd.vn
                LEFT JOIN hospdata.view_ipd_ipd as ipd on request.an = ipd.an 
            WHERE date_result between '${date} 00:00:00' and '${date} 23:59:59'
            Limit ${limit}`;
        const result = await db.raw(sql);
        return result[0];
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
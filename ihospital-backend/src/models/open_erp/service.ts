import Knex = require('knex');

export class ServiceModel {
    getService(knex : Knex, where, order) {
        order = order? order : 'date';
        return knex
            .select('repairorder.*')
            .from('openerp.repairorder')
            .where(where)
            .orderBy(order);
    }

    getServiceEvent(knex : Knex, where, order) {
        order = order? order : 'event_id';
        return knex
            .select('repairorder_event.*', 'employee.title as emp_title', 
                'employee.name as emp_name', 'employee.surname as emp_surname')
            .from('openerp.repairorder_event')
            .leftJoin('employee', 'repairorder_event.employee_code', 'employee.code')
            .where(where)
            .orderBy(order, 'desc');
    }

    saveOrderEvent(knex : Knex, eventId = 0, arrData) {
        if (eventId === 0) {
            return knex('openerp.repairorder_event')
                .insert(arrData)
                .returning('event_id');
        } else {
            return knex('openerp.repairorder_event')
                .update(arrData)
                .where('repairorder_event', '=', eventId)
                .returning('event_id');
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

}
import Knex = require('knex');
import * as moment from 'moment';
import { Employee, Payroll } from './payroll.interface';

export class EmployeeModel {
    getEmployee(knex: Knex, where) {
        return knex('intranet.employee as emp')
            .leftJoin('lib_office as off', 'emp.department', 'off.ref')
            .select('emp.*', 'off.name as dep_name')
            .where(where)
            .orderBy('emp.name')
            .limit(2500);
    }

    saveEmployee(knex: Knex, code, inputData) {
        if (+code > 0) {
            return knex('payroll.employee')
                .update(inputData)
                .where('code', '=', code)
                .returning('code');
        } else {
            return knex('payroll.employee')
                .insert(inputData)
                .returning('code');
        }
    }

    getSalary(knex: Knex, salaryNo, monthly = 0, year = -1) {
        let startMonth = '';
        let endMonth = '';
        year = +year - (+year > 2500 ? 2500 : 0);
        if (+monthly === 0) {
            startMonth = year + '01';
            endMonth = year + '12';
        } else {
            let month = monthly + '';
            month = (+month < 10 ? '0' : '') + (+month);
            startMonth = year + month + '';
            endMonth = startMonth;
        }
        return knex.select('data.*', 'emp.person_id', 'emp.title', 'emp.name', 'emp.surname',
            'emp.position', 'emp.textLevel as level')
            .from('payroll.data')
            .leftJoin('payroll.employee as emp', 'data.no', 'emp.no')
            .where('data.no', '=', salaryNo)
            .whereBetween('data.monthly', [startMonth, endMonth])
            .where('data.isconfirm', '=', '1')
            .orderBy('data.monthly')
            .limit(2500);
    }

    getSalaryItem(knex: Knex, salaryNo, monthly = 0, year = -1) {
        let startMonth = '';
        let endMonth = '';
        year = +year - (+year > 2500 ? 2500 : 0);
        if (+monthly === 0) {
            startMonth = year + '01';
            endMonth = year + '12';
        } else {
            let month = monthly + '';
            month = (+month < 10 ? '0' : '') + (+month);
            startMonth = year + month + '';
            endMonth = startMonth;
        }
        return knex.select('payroll.*', 'l.text as item_name', 'l.type as typegroup')
            .from('payroll.payroll')
            .leftJoin('payroll.lib_paytype as l', 'payroll.type', 'l.code')
            .where('payroll.no', '=', salaryNo)
            .whereBetween('payroll.monthly', [startMonth, endMonth])
            .where('payroll.isconfirm', '=', '1')
            .orderBy('payroll.monthly')
            .limit(2500);
    }

    getTaxYearly(knex: Knex, salaryNo, year = -1) {
        if (year < 2530) {
            return null;
        }
        return knex('payroll.tax_yearly as tax')
            .select('tax.*')
            // .leftJoin('payroll.employee as emp' , 'tax.no' , 'emp.no')
            .where('tax.no', '=', salaryNo)
            .where('tax.yearly', '=', year)
            .limit(1);
    }

    // รถยนต์ส่วนบุคคล ________________________________________
    saveVehicle(db: Knex, id, inputData) {
        if (+id > 0) {
            return db('intranet.employee_vehicle')
                .update(inputData)
                .where('id', '=', id)
                .returning('id');
        } else {
            return db('intranet.employee_vehicle')
                .insert(inputData)
                .returning('id');
        }
    }

    deleteVehicle(db: Knex, id, employeeId = "") {
        return db('intranet.employee_vehicle')
            .where('id', '=', id)
            .where('employee_id', '=', employeeId)
            .del()
            .returning('id');
    }

    getVehicle(db: Knex, employeeId = "") {
        return db('intranet.employee_vehicle as v')
            .leftJoin('intranet.lib_vehicle as l', 'v.car_type', 'l.code')
            .leftJoin('intranet.lib_changwat as ch', 'v.license_changwat', 'ch.code')
            .select('v.*', 'l.name as vehicel_name', 'ch.name as changwat')
            .where('v.employee_id', '=', employeeId)
            .where('v.isactive', '=', '1')
            .orderBy('v.date')
            .limit(2500);
    }

    // ที่จอดรถ ________________________________________
    getEmployeeCarPark(db: Knex, employeeId, period) {
        return db('intranet.employee_carpark')
            .select('*')
            .where('employee_id', '=', employeeId)
            .where('period', '=', period)
            .orderBy('date')
            .limit(2500);
    }

    deleteEmployeeCarPark(db: Knex, id, employeeId) {
        return db('intranet.employee_carpark')
            .where('id', '=', id)
            .where('employee_id', '=', employeeId)
            .del()
    }

    saveEmployeeCarPark(db: Knex, id, inputData) {
        if (+id > 0) {
            return db('intranet.employee_carpark')
                .update(inputData)
                .where('id', '=', id)
                .returning('id');
        } else {
            return db('intranet.employee_carpark')
                .insert(inputData)
                .returning('id');
        }
    }

// radius user สำหรับใช้เล่น Internet
    saveRadcheck(db: Knex, uid = 0, data: any) {
        if (+uid > 0) {
            return db('kkh_radius.radcheck')
                .update(data)
                .where('id', '=', uid)
                .returning('id');
        } else {
            return db('kkh_radius.radcheck')
                .insert(data)
                .returning('id');
        }
    }

    getRadcheck(db: Knex, userName = '', attribute = '') {
        let where: any = {
            username: userName
        }
        if (attribute) {
            where.attribute = attribute;
        }
        return db('kkh_radius.radcheck')
            .select('*')
            .where(where)
            .limit(50);
    }

    saveRadusergroup(db: Knex, id = 0, data: any) {
        if (+id > 0) {
            return db('kkh_radius.radusergroup')
                .update(data)
                .where('id', '=', id)
                .returning('id');
        } else {
            return db('kkh_radius.radusergroup')
                .insert(data)
                .returning('id');
        }
    }

    getRadusergroup(db: Knex, userName = '') {
        let where: any = {
            username: userName
        }
        return db('kkh_radius.radusergroup')
            .select('*')
            .where(where)
            .limit(50);
    }

// ตารางนัดหมาย ________________________________________
    saveCalendar(db: Knex, ref = 0, inputData) {
        if (+ref > 0) {
            return db('intranet.calendar')
                .update(inputData)
                .where('ref', '=', ref)
                .returning('ref');
        } else {
            return db('intranet.calendar')
                .insert(inputData)
                .returning('ref');
        }
    }

    deleteCalendar(db: Knex, ref = 0) {
        return db('intranet.calendar')
            .where('ref', '=', ref)
            .del()
            .returning('ref');
    }

    getCalendar(db: Knex, ref, employeeId, departmentId, dateStart, dateEnd) {
        let where: any = {
            isactive: 1
        };
        if (ref > 0) {
            where.ref = ref;
        }
        if (employeeId > 0) {
            where.id = employeeId;
        }
        if (departmentId !== '') {
            where.department = departmentId;
        }
        return db('intranet.calendar as c')
            .leftJoin('intranet.lib_office as off', 'c.department', 'off.ref')
            .select('c.*', 'off.name as department_name')
            .where(where)
            .whereRaw(db.raw(`(c.date BETWEEN "${dateStart}" AND "${dateEnd} 23:59:59" OR ` +
                `c.date_end BETWEEN "${dateStart}" AND "${dateEnd} 23:59:59")`))
            .orderBy('c.date', 'c.date_end')
            .limit(1000);
    }

    // บัญชีครัวเรือน ________________________________________
    savePayment(db: Knex, ref, inputData) {
        if (+ref > 0) {
            return db('intranet.employee_account')
                .update(inputData)
                .where('ref', '=', ref)
                .returning('ref');
        } else {
            return db('intranet.employee_account')
                .insert(inputData)
                .returning('ref');
        }
    }

    deletePayment(db: Knex, ref, employeeId = "") {
        return db('intranet.employee_account')
            .where('ref', '=', ref)
            .where('id', '=', employeeId)
            .del()
            .returning('ref');
    }

    getPayment(db: Knex, employeeId, dateStart, dateEnd) {
        return db('intranet.employee_account as v')
            .leftJoin('intranet.employee_account_typeuse as l', 'v.typeuse', 'l.id')
            .select('v.*', 'l.name as type_name')
            .where('v.id', '=', employeeId)
            .whereBetween('v.date', [dateStart, dateEnd + ' 23:59:59'])
            .orderBy('v.date', 'desc')
            .limit(2500);
    }
    //     select: 'acc.type, acc.typeuse, t.name as typename, sum(money) as summoney, ' +
    //     'sum(if(acc.type="R",money,0)) as received, sum(if(acc.type="P",money,0)) as paid, ' +
    //     'sum(if(acc.type="P" and acc.credit=1,acc.money,0)) as paid_credit',
    //   from: 'intranet.employee_account as acc 
    //    left join intranet.employee_account_typeuse as t ' +
    //     'on acc.typeuse=t.id',
    //   where: `acc.date BETWEEN "${startDate}" AND "${endDate}" AND acc.id="${this.userInfo.uid}"`,
    //   groupBy: 'acc.type, t.name',
    //   orderBy: 'summoney desc'










    getCarPark(knex: Knex, year) {
        return knex.select('c.*')
            .from('intranet.car_park as c')
            .where('c.year', '=', year)
            .orderBy('c.name')
            .limit(2500);
    }

    searchCarPark(knex: Knex, year, typeSearch, textSearch) {
        return knex.select('c.*')
            .from('intranet.car_park as c')
            .where('c.year', '=', year)
            .where('c.' + typeSearch, 'like', '%' + textSearch + '%')
            .orderBy('c.name')
            .limit(2500);
    }

    saveCarPark(knex: Knex, id, inputData) {
        if (+id > 0) {
            return knex('intranet.car_park')
                .update(inputData)
                .where('id', '=', id)
                .returning('id');
        } else {
            return knex('intranet.car_park')
                .insert(inputData)
                .returning('id');
        }
    }

    deleteCarPark(knex: Knex, id) {
        if (+id > 0) {
            return knex('intranet.car_park')
                .del()
                .where('id', '=', id)
                .returning('id');
        }
    }

    getCarParkComment(knex: Knex, year) {
        return knex.select('cm.*', 'c.fname', 'c.lname', 'c.position', 'c.department')
            .from('intranet.car_park_comment as cm')
            .leftJoin('intranet.car_park as c', 'cm.id', 'c.id')
            .where('c.year', '=', year)
            .orderBy('cm.id')
            .limit(2500);
    }

    saveCarParkComment(knex: Knex, ref, inputData) {
        if (+ref > 0) {
            return knex('intranet.car_park_comment')
                .update(inputData)
                .where('ref', '=', ref)
                .returning('ref');
        } else {
            return knex('intranet.car_park_comment')
                .insert(inputData)
                .returning('ref');
        }
    }

    deleteCarParkComment(knex: Knex, ref) {
        if (+ref > 0) {
            return knex('intranet.car_park_comment')
                .del()
                .where('ref', '=', ref)
                .returning('ref');
        }
    }













    selectSql(knex: Knex, tableName: string, selectText: string, whereText: string, groupBy = '', having = '', orderBy = '', limit = '') {
        let sql = 'select ' + selectText + ' from ' + tableName;
        if (whereText != '') {
            sql = sql + ' where ' + whereText;
        }
        if (groupBy != '') {
            sql = sql + ' group by ' + groupBy;
        }
        if (having != '') {
            sql = sql + ' having ' + having;
        }
        if (orderBy != '') {
            sql = sql + ' order by ' + orderBy;
        }
        if (limit != '') {
            sql = sql + ' limit ' + limit;
        } else {
            if (sql.toLocaleLowerCase().search('limit') < 0) {
                sql = sql + ' limit 0,2000';
            }
        }
        return knex.raw(sql);
    }
}  
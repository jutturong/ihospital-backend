import Knex = require('knex');
import * as moment from 'moment';
import * as _ from 'lodash';
const limitResult = 2000;

export class PayrollModel {
    getEmployee(knex: Knex, where) {
        return knex.select('employee.*')
            .from('intranet.employee')
            .where(where)
            .orderBy('employee.name')
            .limit(2500);
    }

    getEmployees(knex: Knex, columnName, textSearch, limit = 1000) {
        return knex.select('employee.*')
            .from('intranet.employee')
            .where(columnName, '=', textSearch)
            .orderBy('employee.name')
            .limit(limit);
    }

    async searchEmployee(knex: Knex, searchType, searchValue) {
        const result = await knex('payroll.employee as emp')
            .leftJoin('payroll.lib_type as type', 'emp.type', 'type.code')
            .leftJoin('payroll.lib_office as office', 'emp.department', 'office.ref')
            .select('emp.*')
            // .select('emp.id', 'emp.code', 'emp.no', 'emp.person_id'
            //     , 'emp.title', 'emp.name', 'emp.surname'
            //     , 'emp.position', 'emp.level', 'emp.dep'
            //     , 'emp.department', 'emp.type', 'emp.expire'
            //     , 'emp.gpf', 'emp.gpf_rate', 'emp.soc', 'emp.soc_rate'
            //     , 'emp.pfund', 'emp.pfund_rate', 'emp.pfundmoph'
            //     , 'emp.assur_dd', 'emp.assur_no', 'emp.bank_id'
            //     , 'emp.tel', 'emp.tel_mobile', 'emp.tel_home'
            //     , 'emp.textLevel', 'emp.tax_no', 'emp.remark', 'emp.email')
            .select('type.name as emp_type', 'office.name as office_name')
            .where('emp.' + searchType, 'like', searchValue + '%')
            .orderBy('emp.name')
            .orderBy('emp.surname')
            .limit(limitResult);
        for (let row of result) {
            await delete row.passwd;
            await delete row.password;
            await delete row.encr;
            await delete row.sha;
            await delete row.hash;
        }

        return result;
    }

    saveEmployee(knex: Knex, code, inputData) {
        delete inputData.lastupdate;
        delete inputData.code;

        if (+code > 0) {
            return knex('payroll.employee')
                .update(inputData)
                .where('code', '=', code);
        } else {
            return knex('payroll.employee')
                .insert(inputData);
        }
    }

    getBank(knex: Knex, code) {
        const where = {};
        if (+code > 0) {
            where['bank_id'] = code;
        }
        return knex('payroll.lib_bank')
            .select()
            .where(where);
    }

    saveBank(knex: Knex, code, inputData) {
        if (+code > 0) {
            return knex('payroll.lib_bank')
                .update(inputData)
                .where('bank_id', '=', code)
                .returning('bank_id');
        } else {
            return knex('payroll.lib_bank')
                .insert(inputData)
                .returning('bank_id');
        }
    }

    getBankBranch(knex: Knex, code = 0, bank = 0) {
        const where = {};
        if (+code > 0) {
            where['branch_id'] = code;
        }
        if (+bank > 0) {
            where['bank'] = bank;
        }
        return knex('payroll.lib_bank_branch')
            .select()
            .where(where);
    }

    saveBankBranch(knex: Knex, code, inputData) {
        if (+code > 0) {
            return knex('payroll.lib_bank_branch')
                .update(inputData)
                .where('branch_id', '=', code)
                .returning('branch_id');
        } else {
            return knex('payroll.lib_bank_branch')
                .insert(inputData)
                .returning('branch_id');
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
        console.log('get salary:', startMonth, endMonth);
        return knex.select('data.*', 'emp.person_id', 'emp.title', 'emp.name', 'emp.surname',
            'emp.position', 'emp.textLevel as level', 'type.name as emp_type')
            .from('payroll.data')
            .leftJoin('payroll.employee as emp', 'data.no', 'emp.no')
            .leftJoin('payroll.lib_type as type', 'emp.type', 'type.code')
            .where('data.no', '=', salaryNo)
            .whereBetween('data.monthly', [startMonth, endMonth])
            // .where('data.isconfirm', '=', '1')
            .orderBy('data.monthly')
            .limit(2500);
    }

    getSalaryMonthly(knex: Knex, month = 0, year = -1) {
        year = (+year > 1900 && +year < 2100) ? (year + 543) : +year;
        year = +year - (+year > 2500 ? 2500 : 0);
        return knex.select('data.*', 'emp.person_id', 'emp.title', 'emp.name', 'emp.surname',
            'emp.position', 'emp.textLevel as level', 'emp.code as id',
            'type.name as emp_type', 'office.name as office_name')
            .from('payroll.data')
            .leftJoin('payroll.employee as emp', 'data.no', 'emp.no')
            .leftJoin('payroll.lib_office as office', 'emp.department', 'office.ref')
            .leftJoin('payroll.lib_type as type', 'emp.type', 'type.code')
            .where('data.month', '=', month)
            .where('data.year', '=', year)
            .orderBy('data.no')
            .limit(5000);
    }

    searchSalaryMonthly(knex: Knex, searchType, searchValue) {
        if (searchType === 'no') {
            searchType = 'data.no';
        } else if (searchType === 'person_id') {
            searchType = 'emp.person_id';
        } else if (searchType === 'name') {
            searchType = 'emp.name';
        } else if (searchType === 'surname') {
            searchType = 'emp.surname';
        }
        return knex
            .select('data.*', 'emp.person_id', 'emp.title', 'emp.name', 'emp.surname',
                'emp.position', 'emp.textLevel as level', 'emp.code as id',
                'type.name as emp_type', 'office.name as office_name')
            .from('payroll.data')
            .leftJoin('payroll.employee as emp', 'data.no', 'emp.no')
            .leftJoin('payroll.lib_office as office', 'emp.department', 'office.ref')
            .leftJoin('payroll.lib_type as type', 'emp.type', 'type.code')
            .where(searchType, 'like', searchValue + '%')
            // .groupBy('emp.person_id')
            .orderBy(searchType)
            .orderBy('emp.name')
            .orderBy('emp.surname')
            .orderBy('data.salary', 'DESC')
            .limit(5000);
    }

    getSalaryMonthlyItem(knex: Knex, salaryNo, month = 0, year = -1) {
        year = (+year > 1900 && +year < 2100) ? (year + 543) : +year;
        year = +year - (+year > 2500 ? 2500 : 0);
        return knex.select('payroll.*', 'l.text as item_name', 'emp.code as id',
            'emp.person_id', 'emp.title', 'emp.name', 'emp.surname',
            'emp.position', 'emp.textLevel as level', 'office.name as office_name',
            'l.type as type_group', 'type.name as emp_type')
            .from('payroll.payroll')
            .leftJoin('payroll.lib_paytype as l', 'payroll.type', 'l.code')
            .leftJoin('payroll.employee as emp', 'payroll.no', 'emp.no')
            .leftJoin('payroll.lib_office as office', 'emp.department', 'office.ref')
            .leftJoin('payroll.lib_type as type', 'emp.type', 'type.code')
            .where('payroll.no', '=', salaryNo)
            .where('payroll.month', '=', month)
            .where('payroll.year', '=', year)
            .orderBy('payroll.item_type', 'DESC')
            .orderBy('payroll.item', 'DESC')
            .limit(2500);
    }

    getSalaryMonthlyItemAll(knex: Knex, salaryNo) {
        return knex.select('payroll.*', 'l.text as item_name', 'emp.code as id',
            'emp.person_id', 'emp.title', 'emp.name', 'emp.surname', 'type.name as emp_type',
            'emp.position', 'emp.textLevel as level', 'l.type as type_group')
            .from('payroll.payroll')
            .leftJoin('payroll.lib_paytype as l', 'payroll.type', 'l.code')
            .leftJoin('payroll.employee as emp', 'payroll.no', 'emp.no')
            .leftJoin('payroll.lib_type as type', 'emp.type', 'type.code')
            .where('payroll.no', '=', salaryNo)
            .orderBy('payroll.year', 'DESC')
            .orderBy('payroll.month', 'DESC')
            .orderBy('payroll.item_type', 'DESC')
            .orderBy('payroll.item', 'DESC')
            .limit(2500);
    }

    getSalaryItem(knex: Knex, salaryNo, monthly = 0, year = -1) {
        let startMonth = '';
        let endMonth = '';
        year = (+year > 1900 && +year < 2100) ? (year + 543) : +year;
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
        return knex.select('payroll.*', 'l.text as item_name', 'emp.code as id',
            'emp.person_id', 'emp.title', 'emp.name', 'emp.surname', 'type.name as emp_type',
            'emp.position', 'emp.textLevel as level', 'l.type as type_group')
            .from('payroll.payroll')
            .leftJoin('payroll.lib_paytype as l', 'payroll.type', 'l.code')
            .leftJoin('payroll.employee as emp', 'payroll.no', 'emp.no')
            .leftJoin('payroll.lib_type as type', 'emp.type', 'type.code')
            .where('payroll.no', '=', salaryNo)
            .whereBetween('payroll.monthly', [startMonth, endMonth])
            // .where('payroll.isconfirm', '=', '1')
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

    getLibPayType(knex: Knex) {
        return knex('payroll.lib_paytype')
            .leftJoin('payroll.lib_paytype_group', 'lib_paytype.type_group', 'lib_paytype_group.code')
            .select('lib_paytype.*', 'lib_paytype_group.name as group_name')
            .orderBy('type', 'desc')
            .orderBy('text');
    }

    getLibEmployeeType(knex: Knex) {
        return knex('payroll.lib_type').orderBy('seq').orderBy('name');
    }

    getLibPayTypeGroup(knex: Knex) {
        return knex('payroll.lib_paytype_group').orderBy('seq');
    }

    saveSalaryOrder(knex: Knex, data, ref=0) {
        if (+ref > 0) {
            return knex('payroll.salary_order')
                .update(data)
                .where('ref', '=', ref)
                .returning('ref');
        } else {
            return knex('payroll.salary_order')
                .insert(data);
        }
    }

    deleteSalaryOrder(knex: Knex, year, period) {
        const where = { year, period }
        return knex('payroll.salary_order')
            .del()
            .where(where);
    }

    deleteSalaryOrderByRef(knex: Knex, ref) {
        if (+ref > 0) {
            return knex('payroll.salary_order')
                .del()
                .where('ref', '=', ref);
        }
    }





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
            .limit(limitResult);
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
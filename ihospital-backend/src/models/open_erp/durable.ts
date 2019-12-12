import Knex = require('knex');
const maxLimit = 1000;

export class DurableModel {

    getDurable(db: Knex, searchType, searchValue, categorycode = '', department = '') {
        if (!(categorycode && department) && !(searchType && searchValue))
            return null;

        let where: any = ' d.regisno != "" ';
        if (categorycode) {
            where += ` and d.categorycode="${categorycode}" `;
        }
        if (department) {
            where += ` and pay.deptcode="${department}" `;
        }
        if (searchValue) {
            if (searchType === 'durablename') {
                where += ` and d.durablename like "%${searchValue}%" `;
            } else {
                where += ` and d.${searchType} like "${searchValue}%" `;
            }
        }

        return db('openerp.durable as d')
            .select('d.*', 'pay.deptdocdate', 'pay.paydate'
                , 'pay.deptcode', 'dep.deptname'
                , 'pay.isstatus', 'cat.categoryname as catname')
            .leftJoin('openerp.durablepay as pay', 'd.regisno', 'pay.regisno')
            .leftJoin('openerp.department as dep', 'pay.deptcode', 'dep.deptcode')
            .leftJoin('openerp.categorys as cat', 'd.categorycode', 'cat.categorycode')
            .whereRaw(db.raw(where))
            .orderBy('d.durablename')
            .orderBy('d.receivedate')
            .limit(maxLimit);
    }

    categories(db: Knex) {
        return db('openerp.categorys').orderBy('categoryname');
    }

    company(db: Knex) {
        return db('openerp.company').orderBy('cname');
    }

    department(db: Knex) {
        return db('openerp.department').orderBy('deptname');
    }

    sumDurableByCategories(db: Knex, department = '') {
        let where: any = {};
        if (department) {
            where.department = department;
        }
        return db('openerp.durable')
            .select('department', 'categoryname as name')
            .count('categorycode as item_count')
            .where(where)
            .groupBy('categorycode');
    }

    sumDurableByDepartment(db: Knex, categorycode = '') {
        let where: any = {};
        if (categorycode) {
            where.categorycode = categorycode;
        }
        return db('openerp.durable as d')
            .leftJoin('openerp.durablepay as pay', 'd.regisno', 'pay.regisno')
            .leftJoin('openerp.department as dep', 'pay.deptcode', 'dep.deptcode')
            .select('pay.deptcode', 'dep.deptname as name')
            .count('pay.deptcode as item_count')
            .where(where)
            .groupBy('pay.deptcode');
    }

    update(knex: Knex, id: number, data: any) {
        return knex('openerp.durable')
            .where('durablepay.id', id)
            .update(data);
    }
}

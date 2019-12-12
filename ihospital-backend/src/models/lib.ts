import Knex = require('knex');

export class LibModel {

    changwat(db: Knex, code='') {
        return db('hospdata.lib_address as addr')
            .select('addr.*', db.raw('substr(addr.code,1,2) as changwatcode'))
            .whereRaw('substr(addr.code,3,4) = "0000" ')
            .where('addr.isactive', '1')
            .orderBy('addr.name')
            .limit(1000);
    }

    clinic(db: Knex, code='') {
        const where: any = {
            isactive: 1
        };
        if (code !== '') {
            where.code = code;
        }
        return db('hospdata.lib_clinic as lib')
            .select('lib.*')
            .where(where)
            .orderBy('lib.clinic')
            .limit(1000);
    }

    dxClinic(db: Knex, code='') {
        const where: any = {
            isactive: 1
        };
        if (code !== '') {
            where.code = code;
        }
        return db('hospdata.lib_dxclinic as lib')
            .select('lib.*')
            .where(where)
            .orderBy('lib.clinic')
            .limit(1000);
    }

    pttype(db: Knex, code='') {
        const where: any = {
            isactive: 1
        };
        if (code !== '') {
            where.code = code;
        }
        return db('hospdata.lib_pttype as lib')
            .select('lib.*')
            .where(where)
            .orderBy('lib.text')
            .limit(1000);
    }

    paytype(db: Knex, code='') {
        const where: any = {
            isactive: 1
        };
        if (code !== '') {
            where.code = code;
        }
        return db('hospdata.lib_paytype as lib')
            .select('lib.*')
            .where(where)
            .orderBy('lib.describ')
            .limit(1000);
    }

    dr(db: Knex, code='', isexpire = false) {
        const where: any = {
            isactive: 1
        };
        if (code !== '') {
            where.code = code;
        }
        if (isexpire) {
            where.isexpire = '0000-00-00';
        }
        return db('hospdata.lib_dr as lib')
            .select('lib.*')
            .where(where)
            .orderBy('lib.name')
            .limit(1000);
    }

    opdResult(db: Knex, code='', isexpire = false) {
        const where: any = {
            isactive: 1
        };
        if (code !== '') {
            where.code = code;
        }
        return db('hospdata.lib_opd_result as lib')
            .select('lib.*')
            .where(where)
            .orderBy('lib.code')
            .limit(1000);
    }

}  
import Knex = require('knex');
import * as moment from 'moment';

export class IpdModel {
    getIpdVisit(knex: Knex, where, order) {
        return knex.select('view_ipd_ipd.*',
            'concat(admite, " ", time) as dateadm',
            'concat(disc, " ", timedisc) as datedsc')
            .from('view_ipd_ipd')
            .where(where)
            .orderBy(order)
            .limit(5000);
    }

    getIpdByDate(knex: Knex, where, datetype, date1, date2, order) {
        return knex.select('view_ipd_ipd.*',
            'concat(admite, " ", time) as dateadm',
            'concat(disc, " ", timedisc) as datedsc')
            .from('view_ipd_ipd')
            .where(where)
            .whereBetween(datetype, [date1, date2])
            .orderBy(order)
            .limit(5000);
    }

    getDx(knex: Knex, an) {
        return knex.select('*')
            .from('view_ipd_dx')
            .where('an', '=', an)
            .orderBy('type')
            .limit(2500);
    }

    getOp(knex: Knex, an) {
        return knex.select('*')
            .from('view_ipd_op')
            .where('an', '=', an)
            .limit(2500);
    }

    getRx(knex: Knex, an) {
        return knex.select('*')
            .from('view_ipd_rx')
            .where('an', '=', an)
            .orderBy('date')
            .limit(2500);
    }

    sumCharge(knex: Knex, an) {
        let sql = `SELECT item, describ, sum(price) as price, sum(paid) as paid, sum(free) as free ` +
            `FROM view_ipd_charge_item_manual WHERE an="${an}" GROUP BY item ` +
            `UNION ALL ` +
            `SELECT item, describ, sum(price) as price, sum(paid) as paid, sum(free) as free ` +
            `FROM view_ipd_charge_item WHERE an="${an}" GROUP BY item ` ;

        return knex.raw(sql);
    }

    getCharge(knex: Knex, an, typeSum='') {
        if (typeSum.toUpperCase() === 'SUM') {
            return knex.select('an', 'item', 'describ')
                    .sum('price as price')
                    .sum('paid as paid')
                    .sum('free as free')
                .from('view_ipd_charge_item')
                .where('an', '=', an)
                .groupBy('item')
                .orderBy('describ')
                .limit(2500);
        } else {
            return knex.select('*')
                .from('view_ipd_charge_item')
                .where('an', '=', an)
                .orderBy('date')
                .limit(2500);
        }
    }

    getChargeManual(knex: Knex, an, typeSum='') {
        if (typeSum.toUpperCase() === 'SUM') {
            return knex.select('an', 'item', 'describ')
                    .sum('price as price')
                    .sum('paid as paid')
                    .sum('free as free')
                .from('view_ipd_charge_item_manual')
                .where('an', '=', an)
                .groupBy('item')
                .orderBy('describ')
                .limit(2500);
        } else {
            return knex.select('*')
                .from('view_ipd_charge_item_manual')
                .where('an', '=', an)
                .orderBy('date')
                .limit(2500);
        }
    }


}  
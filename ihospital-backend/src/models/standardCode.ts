import Knex = require('knex');
import * as moment from 'moment';

export class StandardCodeModel {
    getBudgetPattern(knex: Knex) {
        return knex('bm_bgpattern')
            .orderBy('bgpattern_id')
    }

    getBudgetType(knex: Knex) {
        return knex('bm_bgtype')
            .orderBy('bgtype_id')
    }
}  
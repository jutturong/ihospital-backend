import Knex = require('knex');
import * as moment from 'moment';

export class OpdModel {
    getOpdVisit(knex: Knex, date, dep) {
        return knex.select('visit.*')
            .from('view_opd_visit as visit')
            .where('date', '=', date)
            .whereIn('visit.dep', dep)
            .orderBy('visit.vn')
            .limit(2500);
    }

    searchOpdVisit(knex: Knex, typeSearch, textSearch) {
        return knex.select('visit.*')
            .from('view_opd_visit as visit')
            .where(typeSearch, 'like', textSearch)
            .orderBy('visit.vn')
            .limit(2500);
    }

    getOpdVS(knex: Knex, vn) {
        return knex.select('*')
            .from('view_opd_vs')
            .where('vn', '=', vn)
            .limit(2500);
    }

    getOpdDx(knex: Knex, vn) {
        return knex.select('*')
            .from('view_opd_dx')
            .where('vn', '=', vn)
            .limit(2500);
    }

    getOpdOp(knex: Knex, vn) {
        return knex.select('*')
            .from('view_opd_op')
            .where('vn', '=', vn)
            .limit(2500);
    }

    getOpdRx(knex: Knex, vn) {
        return knex.select('*')
            .from('view_opd_rx')
            .where('vn', '=', vn)
            .limit(2500);
    }

    getLabResults(knex: Knex, hn) {
        return knex.select('*')
            .from('view_lab_result')
            .where('hn', '=', hn)
            .orderBy('date_result', 'desc')
            .limit(2500);
    }

    getLabResult(knex: Knex, labNo) {
        return knex.select('*')
            .from('view_lab_result')
            .where('lab_no', '=', labNo)
            .limit(2500);
    }

    getOpdDrugs(knex: Knex, hn) {
        return knex.select('*')
            .from('view_pharmacy_opd_drug_item')
            .where('hn', '=', hn)
            .orderBy('date', 'desc')
            .orderBy('vn', 'desc')
            .limit(2500);
    }

    getOpdDrugbyvn(knex: Knex, vn) {
        return knex.select('*')
            .from('view_pharmacy_opd_drug_item')
            .where('vn', '=', vn)
            .limit(2500);
    }

    getOpdDrug(knex: Knex, codePay) {
        return knex.select('*')
            .from('view_pharmacy_opd_drug_item')
            .where('code_pay', '=', codePay)
            .limit(2500);
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

    saveOpdVisit(knex: Knex, vn, arrData) {
        if (vn === '') {
        } else {
            return knex('opd_visit').update(arrData)
                .where('vn', '=', vn)
                .returning('ref');
        }
    }

    saveOpdVs(knex: Knex, vn, arrData) {
        if (vn === '') {
        } else {
            return knex('opd_vs').update(arrData)
                .where('vn', '=', vn)
                .returning('ref');
        }
    }

    saveDrugOpd(knex: Knex, ref, arrData) {
        if (ref === '') {
            return knex('pharmacy_opd_drug_pay')
                .insert(arrData);
        } else {
            return knex('pharmacy_opd_drug_pay')
                .update(arrData)
                .where('code_pay', '=', ref);
        }
    }

    saveDrugItemOpd(knex: Knex, ref, arrData) {
        if (+ref === 0) {
            return knex('pharmacy_opd_item_pay')
                .insert(arrData);
        } else {
            return knex('pharmacy_opd_item_pay')
                .update(arrData)
                .where('ref', '=', ref);
        }
    }

    saveOpdDiag(knex: Knex, ref, arrData, oldData) {
        if (ref > 0) {
            return knex('opd_dx').update(arrData)
                .where('vn', '=', oldData.vn)
                .where('diag', '=', oldData.diag);
        } else {
            return knex('opd_dx').insert(arrData, 'ref');
        }
    }

    removeOpdDiag(knex: Knex, arrData) {
        return knex('opd_dx')
            .where('vn', '=', arrData.vn)
            .where('diag', '=', arrData.diag)
            .del()
            .returning('ref');
    }

    removeOpdDiagbyvn(knex: Knex, vn) {
        if (vn != '') {
            return knex('opd_dx')
                .where('vn', '=', vn)
                .del()
                .returning('vn');
        }
    }

    saveOpdOp(knex: Knex, ref, arrData) {
        if (ref > 0) {
            return knex('opd_op')
                .update(arrData)
                .where('ref', '=', ref)
                .returning('ref');
        } else {
            return knex('opd_op')
                .insert(arrData, 'ref')
                .returning('ref');
        }
    }

    removeOpdOp(knex: Knex, arrData) {
        return knex('opd_op')
            .where('ref', '=', arrData.ref)
            .del().returning('ref');
    }

    removeOpdOpbyvn(knex: Knex, vn) {
        if (vn != '') {
            return knex('opd_op')
                .where('vn', '=', vn)
                .del().returning('vn');
        }
    }

    saveFu(knex: Knex, arrData) {
        if (arrData.ref > 0) {
            return knex('opd_fu').update(arrData)
                .where('ref', '=', arrData.ref)
                .returning('ref');
        } else {
            delete arrData.ref;
            return knex('opd_fu').insert(arrData, 'ref').returning('ref');
        }
    }

    saveAutoincrement(knex: Knex, formInput) {
        return knex('autoincrement')
            .insert(formInput)
            .returning('autoincrement');
    }

    saveAbsent(knex: Knex, ref, arrData) {
        if (ref > 0) {
            return knex('pis_absent')
                .update(arrData)
                .where('ref', '=', ref)
                .returning('ref');
        } else {
            return knex('pis_absent')
                .insert(arrData, 'ref')
                .returning('ref');
        }
    }

    saveAncRegistry(knex: Knex, ref, arrData) {
        if (ref > 0) {
            return knex('anc_registry')
                .update(arrData)
                .where('id', '=', ref)
                .returning('id');
        } else {
            return knex('anc_registry')
                .insert(arrData, 'id')
                .returning('id');
        }
    }

    saveGestationRegistry(knex: Knex, ref, arrData) {
        if (ref > 0) {
            return knex('gestation_registry')
                .update(arrData)
                .where('id', '=', ref)
                .returning('id');
        } else {
            return knex('gestation_registry')
                .insert(arrData, 'id')
                .returning('id');
        }
    }

    saveGestationDetail(knex: Knex, tableName, columnId, ref, arrData) {
        if (ref > 0) {
            return knex('gestation_' + tableName)
                .update(arrData)
                .where(columnId, '=', ref)
                .returning(columnId);
        } else {
            return knex('gestation_' + tableName)
                .insert(arrData, columnId)
                .returning(columnId);
        }
    }

    saveSepsisRegistry(knex: Knex, ref, arrData) {
        if (ref > 0) {
            return knex('sepsis_registry')
                .update(arrData)
                .where('sepsis_id', '=', ref)
                .returning('sepsis_id');
        } else {
            return knex('sepsis_registry')
                .insert(arrData, 'sepsis_id')
                .returning('sepsis_id');
        }
    }

    saveScanToken(knex: Knex, tokenCode, encrToken, type, id) {
        return knex('hospdata.token').insert({
            date: moment().format(),
            user_id: 0,
            created_at: moment().format('x'),
            code: tokenCode,
            token: encrToken,
            employee: 'chart',
            module: 'dr',
            type: 0,
            detail: type + ':' + id,
            expire: moment().add(10, 'seconds').format('YYYY-MM-DD HH:mm:ss')
        }).returning('ref');
    }

}  
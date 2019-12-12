import Knex = require('knex');
import * as moment from 'moment';

export class HospdataModel {
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

    getData(knex: Knex, tableName = '', columnName = '', textSearch, limit = 2500) {
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

    getLib(knex: Knex, typeLib, typeSearch, textSearch, orderCode) {
        let where = {};
        if (textSearch !== '' && typeSearch !== '') {
            if (textSearch.search('%')) {
                where = [typeSearch, 'like', textSearch];
            } else {
                where = { typeSearch: textSearch };
            }
        }
        return knex.select('*')
            .from('lib_' + typeLib)
            .where(where)
            .orderBy(orderCode)
            .limit(2500);
    }

    saveData(knex: Knex, tableName = '', columnPK = '', textSearch, dataArray) {
        if (tableName === '' || columnPK === '' || !dataArray) {
            return null;
        }
        if (columnPK !== '' && textSearch !== '' && textSearch !== '0') {
            return knex(tableName).update(dataArray)
                .where(columnPK, '=', textSearch)
                .returning(columnPK);
        } else {
            return knex(tableName).insert(dataArray)
                .returning(columnPK);
        }
    }

    deleteData(knex: Knex, tableName = '', columnName = '', textSearch) {
        if (tableName === '' || columnName === '' || textSearch === '' || textSearch === '0') {
            return null;
        }
        return knex(tableName).delete()
            .where(columnName, '=', textSearch)
            .limit(1);
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

    getLabRequest(knex: Knex, typeSearch, textSearch) {
        return knex.select('*')
            .from('view_lab_request_item')
            .where(typeSearch, '=', textSearch)
            .orderBy('lab_no')
            .orderBy('lab_code')
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

    getOpdImage(knex: Knex, hn, vn = '') {
        if (hn === '' && vn === '') {
            return [];
        }

        let where: any = { isactive: 1 };
        if (hn) {
            where.hn = hn;
        }
        if (vn) {
            where.vn = vn;
        }
        return knex('opd_images')
            .where(where)
            .limit(50);
    }

    saveOpdImage(knex: Knex, image_id = 0, data) {
        delete data.image_id;
        if (image_id > 0) {
            return knex('opd_images')
                .where({ image_id })
                .update(data);
        } else {
            return knex('opd_images')
                .insert(data);
        }
    }

    async selectSql(knex: Knex, tableName: string, selectText: string, whereText: string, groupBy = '', having = '', orderBy = '', limit = '') {
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
        const result = await knex.raw(sql);
        return result[0];
    }

    saveOpdVisit(knex: Knex, vn, data) {
        return knex('opd_visit').update(data)
            .where({ vn });
    }

    getOpdVS(knex: Knex, vn) {
        return knex.select('*')
            .from('view_opd_vs')
            .where('vn', '=', vn)
            .limit(1);
    }

    async saveOpdVs(knex: Knex, vn, data) {
        const vs = await this.getOpdVS(knex, vn);
        if (vs && vs.length) {
            return knex('opd_vs').update(data)
                .where({ vn });
        } else {
            return knex('opd_vs').insert(data);
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

    getOpdCharge(knex: Knex, typeSearch, textSearch) {
        return knex.select('*')
            .from('view_opd_charge_item')
            .where(typeSearch, '=', textSearch)
            .limit(2500);
    }

    saveCSCDApprove(knex: Knex, vn, arrData) {
        if (vn === '') {
            arrData.vn = vn;
            return knex('opd_charge')
                .insert(arrData, 'vn')
                .returning('vn');
        } else {
            return knex('opd_charge')
                .update(arrData)
                .where('vn', '=', vn)
                .returning('vn');
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

    getPatho(knex: Knex, columnName, textSearch) {
        return knex.select('p.*', 'd.diagnosis')
            .from('pathology_patho as p')
            .leftJoin('pathology_diagnosis as d', 'p.patho_no', 'd.patho_no')
            .where('p.' + columnName, '=', textSearch)
            .orderBy('p.date', 'desc')
            .limit(5000);
    }

    getAddress(knex: Knex, columnName, textSearch, typeSearch = '=') {
        textSearch = typeSearch === 'like' ? ('%' + textSearch + '%') : textSearch;
        return knex.select('*')
            .from('lib_address')
            .where(columnName, typeSearch, textSearch)
            .orderBy('name')
            .limit(1000);
    }

    // report section
    sumFuDrDate(db: Knex, dr, date_start, date_end) {
        return db('opd_fu')
            .select('fu_date', 'dr', 'fu_dep')
            .count('fu_date as cases')
            .whereBetween('fu_date', [date_start, date_end])
            .where({ dr })
            .groupBy('fu_date');
    }

    sumFuDep(db: Knex, dr, date_start, date_end) {
        return db('opd_fu')
            .leftJoin('lib_clinic','opd_fu.fu_dep', 'lib_clinic.code')
            .select('opd_fu.fu_dep', 'lib_clinic.clinic as name')
            .count('opd_fu.fu_dep as cases')
            .whereBetween('opd_fu.fu_date', [date_start, date_end])
            .where('opd_fu.dr', dr)
            .groupBy('opd_fu.fu_dep');
    }

    sumFuDepDate(db: Knex, dr, fu_dep, date_start, date_end) {
        return db('opd_fu')
            .leftJoin('lib_clinic','opd_fu.fu_dep', 'lib_clinic.code')
            .select('opd_fu.fu_date', 'opd_fu.fu_dep', 'lib_clinic.clinic as name')
            .count('opd_fu.fu_date as cases')
            .select(db.raw(`sum(if(dr="${dr}",1,0)) as cases_dr`))
            .whereBetween('opd_fu.fu_date', [date_start, date_end])
            .where('opd_fu.fu_dep', fu_dep)
            .groupBy('opd_fu.fu_date');
    }

}  
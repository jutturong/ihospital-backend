'use strict';

import * as express from 'express';
import * as moment from 'moment';

import { HospdataModel } from '../models/hospdata';
import { LoginModel } from '../models/login';
import { InspectionModel } from '../models/inspection';
import { HospdataService } from '../services/hospdata.service';

const router = express.Router();
const hospdataModel = new HospdataModel();
const loginModel = new LoginModel();
const inspectionModel = new InspectionModel();
const hospdataService = new HospdataService();

router.post('/get-data', (req, res, next) => {
    let columnName: string = req.body.columnName;
    let textSearch: any = req.body.textSearch;
    let moduleName = req.body.moduleName;
    let tokenKey = req.body.tokenKey;

    if (tokenKey === '') {
        res.send({ status: 400, ok: false, rows: [] });
        return;
    }

    const today = moment().format('YYYY-MM-DD HH:mm:ss');
    let db = req.dbHospData;
    loginModel.saveTokenEvent(db, {
        date: today,
        token: tokenKey,
        type: 'get inspection_data',
        ref: '',
        event: columnName + ':' + textSearch
    });

    inspectionModel.getData(db, 'intranet.inspection_data', columnName, textSearch)
        .then((results: any) => {
            console.log('get: inspection_data ' +
                columnName + ':' + textSearch + ' = ' + results.length + ' record<s> founded.');
            res.send({ status: 200, ok: true, rows: results });
        })
        .catch(error => {
            console.log(error);
            res.send({ status: 500, ok: false, error: error })
        })
        .finally(() => {
            db.destroy();
        });
});

router.post('/get-data-by-month', (req, res, next) => {
    let date: any = req.body.date;
    let moduleName = req.body.moduleName;
    let tokenKey = req.body.tokenKey;

    if (tokenKey === '') {
        res.send({ status: 400, ok: false, rows: [] });
        return;
    }

    const today = moment().format('YYYY-MM-DD HH:mm:ss');
    let db = req.dbHospData;
    loginModel.saveTokenEvent(db, {
        date: today,
        token: tokenKey,
        type: 'get inspection_data',
        ref: 'monthly',
        event: 'date:' + date
    });

    inspectionModel.getDataByMonth(db, date)
        .then((results: any) => {
            console.log('get: inspection_data date: ' +
                date + ' = ' + results[0].length + ' record<s> founded.');
            res.send({ status: 200, ok: true, rows: results[0] });
        })
        .catch(error => {
            console.log(error);
            res.send({ status: 500, ok: false, error: error })
        })
        .finally(() => {
            db.destroy();
        });
});

router.post('/save-data', (req, res, next) => {
    let ref: string = req.body.ref;
    let arrData: any = req.body.data;
    let moduleName = req.body.moduleName;
    let tokenKey = req.body.tokenKey;

    if (tokenKey === '') {
        res.send({ status: 400, ok: false, rows: [] });
        return;
    }

    const today = moment().format('YYYY-MM-DD HH:mm:ss');
    let db = req.dbHospData;
    loginModel.saveTokenEvent(db, {
        date: today,
        token: tokenKey,
        type: 'save inspection_data',
        ref: ref,
        event: 'insp_id:' + ref
    });

    inspectionModel.saveData(db, 'intranet.inspection_data', 'insp_id', ref, arrData)
        .then((results: any) => {
            console.log('save: inspection_data ' +
                ref + ' = ' + JSON.stringify(results));
            res.send({ status: 200, ok: true, rows: results });
        })
        .catch(error => {
            console.log(error);
            res.send({ status: 500, ok: false, error: error })
        })
        .finally(() => {
            db.destroy();
        });
});

router.post('/delete-data', (req, res, next) => {
    let ref: string = req.body.ref;
    let moduleName = req.body.moduleName;
    let tokenKey = req.body.tokenKey;

    if (tokenKey === '') {
        res.send({ status: 400, ok: false, rows: [] });
        return;
    }

    const today = moment().format('YYYY-MM-DD HH:mm:ss');
    let db = req.dbHospData;
    loginModel.saveTokenEvent(db, {
        date: today,
        token: tokenKey,
        type: 'delete inspection_data',
        ref: ref,
        event: 'insp_id:' + ref
    });

    inspectionModel.deleteData(db, 'intranet.inspection_data', 'insp_id', ref)
        .then((results: any) => {
            console.log('save: inspection_data ' +
                ref + ': ' + JSON.stringify(results));
            res.send({ status: 200, ok: true, rows: results });
        })
        .catch(error => {
            console.log(error);
            res.send({ status: 500, ok: false, error: error })
        })
        .finally(() => {
            db.destroy();
        });
});

export default router;
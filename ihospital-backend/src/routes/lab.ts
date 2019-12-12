'use strict';

import * as express from 'express';
import * as moment from 'moment';

import { HospdataModel } from '../models/hospdata';
import { LoginModel } from '../models/login';
import { LabModel } from '../models/lab';
import { HospdataService } from '../services/hospdata.service';

const router = express.Router();
const hospdataModel = new HospdataModel();
const loginModel = new LoginModel();
const labModel = new LabModel();
const hospdataService = new HospdataService();

router.post('/get-lab-monitoring', async (req, res, next) => {
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
        type: 'get lab_monitoring',
        ref: '',
        event: columnName + ':' + textSearch
    });

    try {
        const results = await labModel.getData(db, 'lab.lab_monitoring', columnName, textSearch);
        console.log('get: lab_monitoring ' +
            columnName + ':' + textSearch + ' = ' + results.length + ' record<s> founded.');
        res.send({ status: 200, ok: true, rows: results });
    } catch (error) {
        console.log('get: lab_monitoring', error.message);
        res.send({ statusCode: 500, status: 500, ok: false, error: error, message: error.message })
    }

});

router.post('/get-lab-monitoring-by-date', async (req, res, next) => {
    let date: any = req.body.date;
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

    try {
        const results = await labModel.getLabMonitoringByDate(db, date);
        console.log('get: lab_monitoring date: ' +
            date + ' = ' + results.length + ' record<s> founded.');
        res.send({ status: 200, ok: true, rows: results });
    } catch (error) {
        console.log('get: lab_monitoring', error.message);
        res.send({ statusCode: 500, status: 500, ok: false, error: error, message: error.message })
    }

});

router.post('/lab-result', async (req, res, next) => {
    let ref: string = req.body.ref;
    let tokenKey = req.body.tokenKey;

    if (tokenKey === '') {
        res.send({ statusCode: 400, status: 400, ok: false, rows: [] });
        return;
    }

    try {
        let db = req.dbHospData;
        const results = await labModel.getData(db, 'lab.result_rax', 'ref', ref, 1);
        console.log('get lab result: ' + ref + ' success.');
        res.send({ statusCode: 200, status: 200, ok: true, rows: results[0] });
    } catch (error) {
        console.log('get lab resultg', error.message);
        res.send({ statusCode: 500, status: 500, ok: false, error: error, message: error.message })
    }
    let db = req.dbHospData;
});

export default router;
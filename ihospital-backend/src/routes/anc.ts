'use strict';

import * as express from 'express';
import * as moment from 'moment';

import { HospdataModel } from '../models/hospdata';
import { LoginModel } from '../models/login';
import { HospdataService } from '../services/hospdata.service';
import { AncModel } from '../models/anc';

const router = express.Router();
const hospdataModel = new HospdataModel();
const ancModel = new AncModel();
const loginModel = new LoginModel();
const hospdataService = new HospdataService();
const today = moment().format('YYYY-MM-DD HH:mm:ss');

router.get('/', (req, res, next) => {
    res.send({
        status: 200,
        ok: true,
        route: 'anc',
    });
});

router.post('/get-anc-screening', (req, res, next) => {
    let db = req.dbHospData;
    let hn: string = req.body.hn;
    let gravida: any = req.body.gravida;
    let moduleName = req.body.moduleName;
    let tokenKey = req.body.tokenKey;
    if (tokenKey === '') {
        res.send({ status: 400, ok: false, rows: [] });
    }

    ancModel.getAncScreening(db, hn, gravida)
        .then((results: any) => {
            console.log('get anc screening ' + hn + ' = ' + results.length + ' record<s> founded.');
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

router.post('/remove-anc-screening', (req, res, next) => {
    let db = req.dbHospData;
    let screenId: any = req.body.screenId;
    let moduleName = req.body.moduleName;
    let tokenKey = req.body.tokenKey;
    if (tokenKey === '') {
        res.send({ status: 400, ok: false, rows: [] });
    }
    ancModel.deleteAncScreening(db, screenId)
        .then((results: any) => {
            console.log('delete anc screening ' + screenId + ' success.');
            res.send({ status: 200, ok: true, result: results });
        })
        .catch(error => {
            console.log('delete anc screening ' + screenId + ' fail!!! ' + error);
            res.send({ status: 500, ok: false, error: error })
        })
        .finally(() => {
            db.destroy();
        });
});

router.post('/save-anc-screening', (req, res, next) => {
    let db = req.dbHospData;
    let arrData = req.body.arrData;
    let screenId: any = req.body.screenId;
    let moduleName = req.body.moduleName;
    let tokenKey = req.body.tokenKey;
    if (tokenKey === '') {
        res.send({ status: 400, ok: false, rows: [] });
    }
    ancModel.saveAncScreening(db, screenId, arrData)
        .then((results: any) => {
            console.log('save anc screen ' + screenId + '  success.');
            res.send({ status: 200, ok: true, result: results });
        })
        .catch(error => {
            console.log('save anc screen ' + screenId + ' fail!!! ' + error);
            res.send({ status: 500, ok: false, error: error })
        })
        .finally(() => {
            db.destroy();
        });
});

export default router;
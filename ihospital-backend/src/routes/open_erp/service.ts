'use strict';

import * as express from 'express';
import * as moment from 'moment';

import { HospdataModel } from '../../models/hospdata';
import { LoginModel } from '../../models/login';
import { HospdataService } from '../../services/hospdata.service';
import { ServiceModel } from '../../models/open_erp/service';

const router = express.Router();
const hospdataModel = new HospdataModel();
const loginModel = new LoginModel();
const hospdataService = new HospdataService();
const serviceModel = new ServiceModel();

router.get('/', (req, res, next) => {
    res.status(200).send({
        status: 200,
        ok: true,
        module: 'openerp-service',
    });
});

router.post('/service', (req, res, next) => {
    let db = req.dbHospData;
    let depSend: any = req.body.depSend;
    let depDest: any = req.body.depDest;
    let orderId: any = req.body.orderId;
    let date: any = req.body.date;

    let tokenKey = req.body.tokenKey || '';
    if (tokenKey === '' || tokenKey.length < 16) {
        res.send({ status: 400, ok: false, error: 'invalid token' });
    }
    let where = {};
    let order = 'repairno_ref';

    if (orderId && +orderId > 0) {
        where['repairno_ref'] = +orderId;
        order = 'repairno_ref';
    }
    if (date && moment(date)) {
        where['date'] = moment(date).locale('th').format('YYYY-MM-DD');
        order = 'date';
    }
    if (depDest && depDest !== '') {
        where['deptcode1'] = depDest.trim();
        order = 'deptcode1';
    }
    if (depSend && depSend !== '') {
        where['deptcode2'] = depSend.trim();
        order = 'deptcode2';
    }

    if (!where) {
        res.status(400).send({ status: 400, ok: false, error: 'invalid parameters' });
    }

    serviceModel.getService(db, where, order)
        .then((results: any) => {
            console.log('repair order ', where, ' = ' + results.length + ' record<s> founded.');
            res.status(200).send({ status: 200, ok: true, rows: results });
        })
        .catch(error => {
            console.log(error);
            res.status(400).send({ status: 400, ok: false, error: error })
        })
        .finally(() => {
            db.destroy();
        });
});

router.post('/save-service-event', (req, res, next) => {
    let db = req.dbHospData;
    let eventId: any = req.body.eventId || 0;
    let data: any = req.body.data;

    let tokenKey = req.body.tokenKey || '';
    if (tokenKey === '' || tokenKey.length < 16) {
        res.send({ status: 400, ok: false, error: 'invalid token' });
    }

    serviceModel.saveOrderEvent(db, eventId, data)
        .then((results: any) => {
            console.log('save event order ', eventId, results);
            res.status(200).send({ status: 200, ok: true, rows: results });
        })
        .catch(error => {
            console.log(error);
            res.status(400).send({ status: 400, ok: false, error: error })
        })
        .finally(() => {
            db.destroy();
        });
});

router.post('/get-service-event', (req, res, next) => {
    let db = req.dbHospData;
    let eventId: any = req.body.eventId || 0;
    let date: any = req.body.date;
    let date_start: any = req.body.dateStart;
    let employee_code: any = req.body.employeeCode;
    let repairno_ref: any = req.body.repairnoRef;

    let tokenKey = req.body.tokenKey || '';
    if (tokenKey === '' || tokenKey.length < 16) {
        res.send({ status: 400, ok: false, error: 'invalid token' });
    }

    let where = {};
    let order = 'repairorder_event.event_id';

    if (eventId && +eventId > 0) {
        where['event_id'] = +eventId;
    }
    if (date && moment(date)) {
        where['repairorder_event.date'] = moment(date).locale('th').format('YYYY-MM-DD');
        order = 'date';
    }
    if (employee_code && employee_code > 0) {
        where['repairorder_event.employee_code'] = employee_code;
    }
    if (repairno_ref && repairno_ref !== '') {
        where['repairorder_event.repairno_ref'] = repairno_ref;
    }

    if (!where) {
        res.status(400).send({ status: 400, ok: false, error: 'invalid parameters' });
    }

    serviceModel.getServiceEvent(db, where, order)
        .then((results: any) => {
            console.log('repair order event ', where, ' = ' + results.length + ' record<s> founded.');
            res.status(200).send({ status: 200, ok: true, rows: results });
        })
        .catch(error => {
            console.log(error);
            res.status(400).send({ status: 400, ok: false, error: error })
        })
        .finally(() => {
            db.destroy();
        });});

export default router;
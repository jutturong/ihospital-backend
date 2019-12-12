'use strict';

import * as express from 'express';
import * as moment from 'moment';

import { LoginModel } from '../models/login';
import { EmployeeModel } from '../models/employee';
import { TimeAttendanceModel } from '../models/time-attendance';

const router = express.Router();
const employeeModel = new EmployeeModel();
const timeAttendanceModel = new TimeAttendanceModel();
const today = moment().format('YYYY-MM-DD HH:mm:ss');
let errorRespond = {};

router.get('/', (req, res, next) => {
    res.send({
        ok: true,
        module: 'time-attendance',
        date: today,
        token: 'none'
    });
});

router.post('/get-time-attendance', (req, res, next) => {
    let db = req.dbHospData;
    let employeeId: any = req.body.employeeId;
    let whereIs: any = req.body.whereIs;
    timeAttendanceModel.getTimeAttd(db, whereIs)
        .then((results: any) => {
            console.log('get time attendance ', whereIs, ' = ' + results.length + ' record<s> founded.');
            res.send({ status: 200, ok: true, rows: results });
        })
        .catch(error => {
            console.log('get time attendance error: ', error);
            res.send({ status: 400, ok: false, error: error });
        })
        .finally(() => {
            db.destroy();
        });
});

router.post('/save-time-attendance', (req, res, next) => {
    let db = req.dbHospData;
    let ref: any = req.body.ref;
    let type: any = req.body.type || 'IN';
    let data: any = req.body.data;
    if (type === 'IN') {
        data.date_in = moment().locale('th').format('YYYY-MM-DD HH:mm:ss');
    } else {
        data.date_out = moment().locale('th').format('YYYY-MM-DD HH:mm:ss');
    }
    timeAttendanceModel.saveTimeAttd(db, data, ref)
        .then((result: any) => {
            res.status(200).send({ status: 200, ok: true, ref: result.ref, result: result });
        })
        .catch(error => {
            res.send({ status: 400, ok: false, error: error });
        });
});

export default router;
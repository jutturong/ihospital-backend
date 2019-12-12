'use strict';

import * as express from 'express';
import * as HttpStatus from 'http-status-codes';
import { HospdataModel } from '../models/hospdata';

const router = express.Router();
const hospdataModel = new HospdataModel();

router.post('/fu-date-dr', async (req, res, next) => {
    let db = req.dbHospData;
    let date_start = req.body.date_start;
    let date_end = req.body.date_end;
    let dr = req.body.dr;

    if (dr && date_start && date_end) {
        try {
            const result: any = await hospdataModel.sumFuDrDate(db, dr, date_start, date_end);
            res.send({ statusCode: HttpStatus.OK, rows: result });
        } catch (error) {
            res.send({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message
            });
        }
    } else {
        res.send({
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'not found parameter!'
        });
    }
});

router.post('/fu-dep', async (req, res, next) => {
    let db = req.dbHospData;
    let date_start = req.body.date_start;
    let date_end = req.body.date_end;
    let dr = req.body.dr;

    if (dr && date_start && date_end) {
        try {
            const result: any = await hospdataModel.sumFuDep(db, dr, date_start, date_end);
            res.send({ statusCode: HttpStatus.OK, rows: result });
        } catch (error) {
            res.send({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message
            });
        }
    } else {
        res.send({
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'not found parameter!'
        });
    }
});

router.post('/fu-date-dep', async (req, res, next) => {
    let db = req.dbHospData;
    let date_start = req.body.date_start;
    let date_end = req.body.date_end;
    let dep = req.body.dep;
    let dr = req.body.dr;

    if (dep && date_start && date_end) {
        try {
            const result: any = await hospdataModel.sumFuDepDate(db, dr, dep, date_start, date_end);
            res.send({ statusCode: HttpStatus.OK, rows: result });
        } catch (error) {
            res.send({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message
            });
        }
    } else {
        res.send({
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'not found parameter!'
        });
    }
});

export default router;

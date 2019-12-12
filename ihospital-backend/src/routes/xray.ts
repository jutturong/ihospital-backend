'use strict';

import * as express from 'express';
import * as moment from 'moment';
import { XrayModel } from '../models/xray';

const router = express.Router();
const xrayModel = new XrayModel();
const today = moment().format('YYYY-MM-DD HH:mm:ss');

router.post('/get/:columnName/:value', (req, res, next) => {
    let columnName = req.params.columnName;
    let value = req.params.value;

    let tokenKey = req.body.tokenKey || '';
    if (tokenKey === '' || tokenKey.length < 16) {
        res.send({ status: 400, ok: false, error: 'invalid token' });
        return ;
    }

    const today = moment().format('YYYY-MM-DD HH:mm:ss');
    let db = req.dbHospData;
    xrayModel.getXray(db, columnName, value)
        .then((results: any) => {
            console.log(`get xray ${columnName} = ${value} ` + results.length + ' record<s> founded.');
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
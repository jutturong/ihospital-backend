'use strict';

import * as express from 'express';
import * as moment from 'moment';

import { LibModel } from '../models/lib';

const router = express.Router();
const libModel = new LibModel();

router.post('/changwat', (req, res, next) => {
    let db = req.dbHospData;
    let code = req.body.code || '';
    libModel.changwat(db, code)
        .then((results: any) => {
            res.status(200).send({ status: 200, ok: true, rows: results });
        })
        .catch(error => {
            console.log(error);
            res.status(500).send({ status: 500, ok: false, error: error })
        })
        .finally(() => {
            db.destroy();
        });
});

router.get('/clinic', (req, res, next) => {
    let db = req.dbHospData;
    let code = req.params.code || '';
    libModel.clinic(db, code)
        .then((results: any) => {
            res.status(200).send({ status: 200, ok: true, rows: results });
        })
        .catch(error => {
            console.log(error);
            res.send({ status: 500, ok: false, error: error })
        })
        .finally(() => {
            db.destroy();
        });
});

router.get('/dxclinic', (req, res, next) => {
    let db = req.dbHospData;
    let code = req.params.code || '';
    libModel.dxClinic(db, code)
        .then((results: any) => {
            res.status(200).send({ status: 200, ok: true, rows: results });
        })
        .catch(error => {
            console.log(error);
            res.send({ status: 500, ok: false, error: error })
        })
        .finally(() => {
            db.destroy();
        });
});

router.get('/pttype/:code', (req, res, next) => {
    let db = req.dbHospData;
    let code = req.params.code || '';
    code = code === "all" ? '' : code;
    libModel.pttype(db, code)
        .then((results: any) => {
            res.status(200).send({ status: 200, ok: true, rows: results });
        })
        .catch(error => {
            console.log(error);
            res.send({ status: 500, ok: false, error: error })
        })
        .finally(() => {
            db.destroy();
        });
});

router.get('/paytype/:code', (req, res, next) => {
    let db = req.dbHospData;
    let code = req.params.code || '';
    code = code === "all" ? '' : code;
    libModel.paytype(db, code)
        .then((results: any) => {
            res.status(200).send({ status: 200, ok: true, rows: results });
        })
        .catch(error => {
            console.log(error);
            res.send({ status: 500, ok: false, error: error })
        })
        .finally(() => {
            db.destroy();
        });
});

router.get('/dr/:code', (req, res, next) => {
    let db = req.dbHospData;
    let code = req.params.code || '';
    code = code === "all" ? '' : code;
    libModel.dr(db, code)
        .then((results: any) => {
            res.status(200).send({ status: 200, ok: true, rows: results });
        })
        .catch(error => {
            console.log(error);
            res.send({ status: 500, ok: false, error: error })
        })
        .finally(() => {
            db.destroy();
        });
});

router.get('/opd-result/:code', (req, res, next) => {
    let db = req.dbHospData;
    let code = req.params.code || '';
    code = code === "all" ? '' : code;
    libModel.opdResult(db, code)
        .then((results: any) => {
            res.status(200).send({ status: 200, ok: true, rows: results });
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
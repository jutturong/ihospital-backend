'use strict';

import * as express from 'express';
import * as moment from 'moment';
import * as HttpStatus from 'http-status-codes';

import { DurableModel } from '../../models/open_erp/durable';

const router = express.Router();
const durableModel = new DurableModel();

router.post('/search', async (req, res, next) => {
    const db = req.dbHospData;
    const searchType: any = req.body.searchType;
    const searchValue: any = req.body.searchValue;
    const categorycode: any = req.body.categorycode;
    const department: any = req.body.department;

    if ((categorycode && department) || (searchType && searchValue)) {
        try {
            const result: any = await durableModel.getDurable(db, searchType, searchValue, categorycode, department)
            res.send({
                statusCode: HttpStatus.OK,
                rows: result
            });
        } catch (error) {
            console.log('durable search', error.message);
            res.send({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message
            });
        }
    }
});

router.post('/categories', async (req, res, next) => {
    let db = req.dbHospData;
    try {
        const result: any = await durableModel.categories(db)
        res.send({
            statusCode: HttpStatus.OK,
            rows: result
        });
    } catch (error) {
        console.log('durable categories', error.message);
        res.send({
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: error.message
        });
    }
});

router.post('/company', async (req, res, next) => {
    let db = req.dbHospData;
    try {
        const result: any = await durableModel.company(db)
        res.send({
            statusCode: HttpStatus.OK,
            rows: result
        });
    } catch (error) {
        console.log('durable company', error.message);
        res.send({
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: error.message
        });
    }
});

router.post('/department', async (req, res, next) => {
    let db = req.dbHospData;
    try {
        const result: any = await durableModel.department(db)
        res.send({
            statusCode: HttpStatus.OK,
            rows: result
        });
    } catch (error) {
        console.log('durable department', error.message);
        res.send({
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: error.message
        });
    }
});

router.post('/sum-categories', async (req, res, next) => {
    const db = req.dbHospData;
    const department = req.body.department;

    try {
        const result: any = await durableModel.sumDurableByCategories(db, department)
        res.send({
            statusCode: HttpStatus.OK,
            rows: result
        });
    } catch (error) {
        console.log('durable sum-Categories', error.message);
        res.send({
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: error.message
        });
    }
});

router.post('/sum-department', async (req, res, next) => {
    const db = req.dbHospData;
    const categories = req.body.categories;

    try {
        const result: any = await durableModel.sumDurableByDepartment(db, categories)
        res.send({
            statusCode: HttpStatus.OK,
            rows: result
        });
    } catch (error) {
        console.log('durable sum-department', error.message);
        res.send({
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: error.message
        });
    }
});

router.put('/:id', (req, res, next) => {
    let id = req.params.id;
    let data = req.body.data;
    let db = req.db;
    if (id) {
        durableModel.update(db, id, data)
            .then((result: any) => {
                res.send({ ok: true, row: result })
            })
            .catch(error => {
                res.send({ ok: false, error: error })
            })
            .finally(() => {
                db.destroy();
            });
    } else {
        res.send({ ok: false, error: 'ข้อมูลไม่สมบูรณ์' });
    }
});

export default router;
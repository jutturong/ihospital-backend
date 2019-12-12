// สำหรับ routes ที่ยังไม่ได้จำแนก หรือ เป็น routes กลาง

'use strict';

import * as express from 'express';
import { MainModel } from '../models/main';

const router = express.Router();
const mainModel = new MainModel();

router.post('/get-office', (req, res, next) => {
    let db = req.dbHospData;
    let typeSearch: string = req.body.typeSearch;
    let textSearch: string = req.body.textSearch;
    mainModel.getOffice(db, typeSearch, textSearch)
        .then((results: any) => {
            console.log(' get: office ' + typeSearch + ": " + textSearch + ' = ' + results.length + ' record<s> founded.');
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

router.post('/get-holiday', async (req, res, next) => {
    let db = req.dbHospData;
    let dateStart = req.body.dateStart;
    let dateEnd = req.body.dateEnd || dateStart;

    try {
        const result: any = await mainModel.getHoliday(db, dateStart, dateEnd);
        res.send({
            ok: true,
            statusCode: 200,
            rows: result
        });
    } catch (error) {
        res.send({
            ok: false,
            statusCode: 500,
            message: error.message
        });
    }

});

router.post('/get-building', (req, res, next) => {
    let db = req.dbHospData;
    mainModel.getBuilding(db)
        .then((results: any) => {
            console.log(' get building ' + results.length + ' record<s> founded.');
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
router.post('/search-building', (req, res, next) => {
    let typeSearch: string = req.body.typeSearch;
    let textSearch: string = req.body.textSearch;
    let dbCon = req.dbHospData;
    mainModel.getBuildingBySearch(dbCon, typeSearch, textSearch)
        .then((results: any) => {
            console.log(' get: building ' + typeSearch + ": " + textSearch + ' = ' + results.length + ' record<s> founded.');
            res.send({ status: 200, ok: true, rows: results });
        })
        .catch(error => {
            console.log(error);
            res.send({ status: 500, ok: false, error: error })
        })
        .finally(() => {
            dbCon.destroy();
        });
});

router.post('/get-phone-internal', (req, res, next) => {
    let typeSearch: string = req.body.typeSearch;
    let textSearch: string = req.body.textSearch;
    let dbCon = req.dbHospData;
    mainModel.getInternalPhone(dbCon, typeSearch, textSearch)
        .then((results: any) => {
            console.log(' get: phone-internal ' + typeSearch + ": " + textSearch + ' = ' + results.length + ' record<s> founded.');
            res.send({ status: 200, ok: true, rows: results });
        })
        .catch(error => {
            console.log(error);
            res.send({ status: 500, ok: false, error: error })
        })
        .finally(() => {
            dbCon.destroy();
        });
});

router.post('/save-phone-internal', (req, res, next) => {
    let phoneNo = req.body.phoneNo || '';
    let data = req.body.data;
    let dbCon = req.dbHospData;
    mainModel.saveInternalPhone(dbCon, phoneNo, data)
        .then((results: any) => {
            console.log('save phone-internal: ' + phoneNo + ' success.', results);
            res.send({ status: 200, ok: true, result: results });
        })
        .catch(error => {
            console.log('save phone-internal: ' + phoneNo + ' fail!!', error);
            res.send({ status: 500, ok: false, error: error })
        })
        .finally(() => {
            dbCon.destroy();
        });
});

export default router;
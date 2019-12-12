'use strict';

import * as express from 'express';
import { KpiModel } from '../../models/kpi/kpi-model';
import * as HttpStatus from 'http-status-codes';
import * as multer from 'multer';

const router = express.Router();
const kpiModel = new KpiModel();
const uploadPath = 'public/kpi-upload/';

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadPath)
    },
  });
  
var upload = multer({ storage: storage })

router.get('/', (req, res, next) => {
    res.status(HttpStatus.OK).send({ statusCode: HttpStatus.OK, message: HttpStatus.getStatusText(HttpStatus.OK), route: 'kpi route' })
    // res.send({ status: 200, ok: true, route: 'kpi route' });
});

router.get('/get-topic', async (req, res, next) => {
    let db = req.dbHospData;
    try {
        const result = await kpiModel.getTopic(db);
        res.status(HttpStatus.OK).send({ statusCode: HttpStatus.OK, rows: result })
    }
    catch (error) {
        res.status(HttpStatus.OK).send({ statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: error.message })
    };
});

router.get('/get-active-topic', async (req, res, next) => {
    let db = req.dbHospData;
    try {
        const result = await kpiModel.getActiveTopic(db);
        res.status(HttpStatus.OK).send({ statusCode: HttpStatus.OK, rows: result })
    }
    catch (error) {
        res.status(HttpStatus.OK).send({ statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: error.message })
    };
});

router.post('/save-topic',upload.single('file'), async (req, res, next) => {
    let db = req.dbHospData;
    const kpiId = req.body.kpiId || 0;
    const data = req.body.data;
    let file: any = req.file;
    if(file){
        data.origainal_name = file.originalname;
        data.filename = file.filename;
        // data.path = file.path;
        // data.size = file.size;
        // data.size = file.size;
        // data.hcode = file.originalname.slice(0,5);
      }

    if (data) {
        try {
            const result = await kpiModel.saveTopic(db, kpiId, data);
            res.status(HttpStatus.OK).send({ statusCode: HttpStatus.OK, rows: result })
        }
        catch (error) {
            console.log('save topic error:', error.message);
            res.status(HttpStatus.OK).send({ statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: error.message })
        };
    } else {
        res.status(HttpStatus.OK).send({ statusCode: HttpStatus.BAD_REQUEST, message: HttpStatus.getStatusText(HttpStatus.BAD_REQUEST) })
    }
});


router.get('/get-topic-by-group/:groupId', (req, res, next) => {
    let db = req.dbHospData;
    const groupId = req.params.groupId;
    kpiModel.getTopicByGroup(db,groupId)
        .then((results: any) => {
            console.log('get Topic by Group' + results.length + ' record<s> founded.');
            // res.send({ status: 200, ok: true,  });
            res.status(HttpStatus.OK).send({ statusCode: HttpStatus.OK, message: HttpStatus.getStatusText(HttpStatus.OK), rows: results })
        })
        .catch(error => {
            console.log(error);
            // res.send({ status: 500, ok: false, error: error })
            res.status(HttpStatus.OK).send({ statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: error.message })
        })
        .finally(() => {
            db.destroy();
        });
});

router.get('/get-active-topic-by-group/:groupId', (req, res, next) => {
    let db = req.dbHospData;
    const groupId = req.params.groupId;
    kpiModel.getActiveTopicByGroup(db,groupId)
        .then((results: any) => {
            console.log('get Topic by Group' + results.length + ' record<s> founded.');
            // res.send({ status: 200, ok: true,  });
            res.status(HttpStatus.OK).send({ statusCode: HttpStatus.OK, message: HttpStatus.getStatusText(HttpStatus.OK), rows: results })
        })
        .catch(error => {
            console.log(error);
            // res.send({ status: 500, ok: false, error: error })
            res.status(HttpStatus.OK).send({ statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: error.message })
        })
        .finally(() => {
            db.destroy();
        });
});

router.post('/save-topic-by-group', async (req, res, next) => {
    let db = req.dbHospData;
    const ref = req.body.ref || 0;
    const data = req.body.data;
    if (data) {
        try {
            const result = await kpiModel.saveGroupTopic(db, ref, data);
            res.status(HttpStatus.OK).send({ statusCode: HttpStatus.OK, rows: result })
        }
        catch (error) {
            console.log('save topic group error:', error.message);
            res.status(HttpStatus.OK).send({ statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: error.message })
        };
    } else {
        res.status(HttpStatus.OK).send({ statusCode: HttpStatus.BAD_REQUEST, message: HttpStatus.getStatusText(HttpStatus.BAD_REQUEST) })
    }
});


router.get('/get-group', (req, res, next) => {
    let db = req.dbHospData;
    kpiModel.getGroup(db)
        .then((results: any) => {
            console.log('get group ' + results.length + ' record<s> founded.');
            // res.send({ status: 200, ok: true,  });
            res.status(HttpStatus.OK).send({ statusCode: HttpStatus.OK, message: HttpStatus.getStatusText(HttpStatus.OK), rows: results })
        })
        .catch(error => {
            console.log(error);
            // res.send({ status: 500, ok: false, error: error })
            res.status(HttpStatus.OK).send({ statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: error.message })
        })
        .finally(() => {
            db.destroy();
        });
});

router.get('/get-active-group', (req, res, next) => {
    let db = req.dbHospData;
    kpiModel.getActiveGroup(db)
        .then((results: any) => {
            console.log('get group ' + results.length + ' record<s> founded.');
            // res.send({ status: 200, ok: true,  });
            res.status(HttpStatus.OK).send({ statusCode: HttpStatus.OK, message: HttpStatus.getStatusText(HttpStatus.OK), rows: results })
        })
        .catch(error => {
            console.log(error);
            // res.send({ status: 500, ok: false, error: error })
            res.status(HttpStatus.OK).send({ statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: error.message })
        })
        .finally(() => {
            db.destroy();
        });
});

router.post('/save-group', async (req, res, next) => {
    let db = req.dbHospData;
    const groupId = req.body.groupId || 0;
    const data = req.body.data;
    if (data) {
        try {
            const result = await kpiModel.saveGroup(db, groupId, data);
            res.status(HttpStatus.OK).send({ statusCode: HttpStatus.OK, rows: result })
        }
        catch (error) {
            console.log('save group error:', error.message);
            res.status(HttpStatus.OK).send({ statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: error.message })
        };
    } else {
        res.status(HttpStatus.OK).send({ statusCode: HttpStatus.BAD_REQUEST, message: HttpStatus.getStatusText(HttpStatus.BAD_REQUEST) })
    }
});


router.get('/get-kpi-input/:groupId', (req, res, next) => {
    let db = req.dbHospData;
    const groupId = req.params.groupId;
    kpiModel.getKpiForInput(db,groupId)
        .then((results: any) => {
            console.log('get kpi for Input' + results.length + ' record<s> founded.');
            // res.send({ status: 200, ok: true,  });
            res.status(HttpStatus.OK).send({ statusCode: HttpStatus.OK, message: HttpStatus.getStatusText(HttpStatus.OK), rows: results })
        })
        .catch(error => {
            console.log(error);
            // res.send({ status: 500, ok: false, error: error })
            res.status(HttpStatus.OK).send({ statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: error.message })
        })
        .finally(() => {
            db.destroy();
        });
});

router.get('/get-kpi-data/:kpi_id/:year', (req, res, next) => {
    let db = req.dbHospData;
    let kpi_id = req.params.kpi_id;
    let year = req.params.year;
    // const month = req.params.month;
    kpiModel.getKpiData(db,kpi_id,year)
        .then((results: any) => {
            console.log('get kpi data' + results.length + ' record<s> founded.');
            // res.send({ status: 200, ok: true,  });
            res.status(HttpStatus.OK).send({ statusCode: HttpStatus.OK, message: HttpStatus.getStatusText(HttpStatus.OK), rows: results })
        })
        .catch(error => {
            console.log(error);
            // res.send({ status: 500, ok: false, error: error })
            res.status(HttpStatus.OK).send({ statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: error.message })
        })
        .finally(() => {
            db.destroy();
        });
});

router.post('/save-kpi-data', async (req, res, next) => {
    let db = req.dbHospData;
    // const ref = req.body.ref || 0;
    const data = req.body.data;
    if (data) {
        try {
            const result = await kpiModel.saveKpiData(db, data);
            res.status(HttpStatus.OK).send({ statusCode: HttpStatus.OK, rows: result })
        }
        catch (error) {
            console.log('save kpi data error:', error.message);
            res.status(HttpStatus.OK).send({ statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: error.message })
        };
    } else {
        res.status(HttpStatus.OK).send({ statusCode: HttpStatus.BAD_REQUEST, message: HttpStatus.getStatusText(HttpStatus.BAD_REQUEST) })
    }
});

router.post('/update-kpi-data/:kpi_id/:year/:month', async (req, res, next) => {
    let db = req.dbHospData;
    const data = req.body.data;
    const kpi_id = req.body.kpi_id;
    const year = req.body.year;
    const month = req.body.month;
    if (data) {
        try {
            const result = await kpiModel.updateKpiData(db,kpi_id,year,month, data);
            res.status(HttpStatus.OK).send({ statusCode: HttpStatus.OK, rows: result })
        }
        catch (error) {
            console.log('save kpi data error:', error.message);
            res.status(HttpStatus.OK).send({ statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: error.message })
        };
    } else {
        res.status(HttpStatus.OK).send({ statusCode: HttpStatus.BAD_REQUEST, message: HttpStatus.getStatusText(HttpStatus.BAD_REQUEST) })
    }
});

router.post('/update-kpi-multi/:kpi_id', async (req, res, next) => {
    let db = req.dbHospData;
    const data = req.body.data;
    const kpi_id = req.body.kpi_id;
    if (data) {
        try {
            const result = await kpiModel.updateKpiMulti(db,kpi_id, data);
            res.status(HttpStatus.OK).send({ statusCode: HttpStatus.OK, rows: result })
        }
        catch (error) {
            console.log('save kpi data error:', error.message);
            res.status(HttpStatus.OK).send({ statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: error.message })
        };
    } else {
        res.status(HttpStatus.OK).send({ statusCode: HttpStatus.BAD_REQUEST, message: HttpStatus.getStatusText(HttpStatus.BAD_REQUEST) })
    }
});

export default router;
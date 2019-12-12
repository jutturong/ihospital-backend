'use strict';

import * as express from 'express';
import { KpiReport } from '../../models/kpi/kpi-report';
import * as HttpStatus from 'http-status-codes';
import * as multer from 'multer';

const router = express.Router();
const kpiModel = new KpiReport();
const uploadPath = 'public/kpi-upload/';

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadPath)
    },
  });
  
var upload = multer({ storage: storage })

router.get('/get-report-fiscal/:kpi_id/:fiscal', (req, res, next) => {
    let db = req.dbHospData;
    let kpi_id = req.params.kpi_id;
    let fiscal = req.params.fiscal;
    kpiModel.getReportByFiscal(db,kpi_id,fiscal)
        .then((results: any) => {
            console.log('get report ' + results.length + ' record<s> founded.');
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



export default router;
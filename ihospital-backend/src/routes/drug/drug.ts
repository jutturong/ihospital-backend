'use strict';

import * as express from 'express';
import * as HttpStatus from 'http-status-codes';
import * as moment from 'moment';
import { IpdDrugModel } from '../../models/drug/ipd_drug';

const router = express.Router();
const today = moment().format('YYYY-MM-DD HH:mm:ss');

let ipdDrugModel = new IpdDrugModel();

router.get('/tbl', async (req, res, next) => {
  let dbDrug = req.dbDrug;
  const result = await ipdDrugModel.getTableName(dbDrug);
  res.send({
    statusCode: 200,
    module: 'Pharmacy',
    date: today,
    tbl: result
  });
});

router.get('/get-drug-generic', (req, res, next) => {
  let dbDrug = req.dbDrug;

  ipdDrugModel.getDrugGeneric(dbDrug)
    .then((results: any) => {
      res.status(HttpStatus.OK).send({ statusCode: HttpStatus.OK, ok: true, rows: results })
    })
    .catch(error => {
      console.log(error);
      res.send({ statusCode: 400, ok: false, error: error });
      res.status(HttpStatus.NOT_ACCEPTABLE).send({ statusCode: HttpStatus.NOT_ACCEPTABLE })
    })
    .finally(() => {
      dbDrug.destroy();
    });
});

router.get('/search-drug-generic/:columnName/:searchValue', (req, res, next) => {
  let dbDrug = req.dbDrug;
  const columnName= req.params.columnName || 'genericname';
  const searchValue= req.params.searchValue || '';

  ipdDrugModel.searchDrugGeneric(dbDrug, columnName, searchValue)
    .then((results: any) => {
      res.status(HttpStatus.OK).send({ statusCode: HttpStatus.OK, ok: true, rows: results })
    })
    .catch(error => {
      console.log(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ statusCode: HttpStatus.INTERNAL_SERVER_ERROR })
    })
    .finally(() => {
      dbDrug.destroy();
    });
});


export default router;
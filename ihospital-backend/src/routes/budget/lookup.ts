'use strict';

import * as express from 'express';
import * as moment from 'moment';

import { LookupModel } from '../../models/budget/lookup';
import { LoginModel } from '../../models/login';
import { HospdataService } from '../../services/hospdata.service';

const router = express.Router();
const loginModel = new LoginModel();
const hospdataService = new HospdataService();
const today = moment().format('YYYY-MM-DD HH:mm:ss');
const model = new LookupModel();

router.get('/listBudgetType', (req, res, next) => {

  let db = req.dbHospData;

  model.listBudgetType(db)
    .then((results: any) => {
      res.send({ ok: true, rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});

router.get('/listPosition', (req, res, next) => {

  let db = req.dbHospData;

  model.listPosition(db)
    .then((results: any) => {
      res.send({ ok: true, rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});

router.get('/listOt', (req, res, next) => {

  let db = req.dbHospData;

  model.listOt(db)
    .then((results: any) => {
      res.send({ ok: true, rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});

router.get('/listGeneral', (req, res, next) => {

  let db = req.dbHospData;

  model.listGeneral(db)
    .then((results: any) => {
      res.send({ ok: true, rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});

router.get('/listOperate', (req, res, next) => {

  let db = req.dbHospData;

  model.libOperate(db)
    .then((results: any) => {
      res.send({ ok: true, rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});
router.get('/listOffice', (req, res, next) => {

  let db = req.dbHospData;

  model.libOffice(db)
    .then((results: any) => {
      res.send({ ok: true, rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});
router.get('/listCom', (req, res, next) => {

  let db = req.dbHospData;

  model.libCom(db)
    .then((results: any) => {
      res.send({ ok: true, rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});
router.get('/listMed', (req, res, next) => {

  let db = req.dbHospData;

  model.libMed(db)
    .then((results: any) => {
      res.send({ ok: true, rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});
router.get('/listGen', (req, res, next) => {

  let db = req.dbHospData;

  model.libGen(db)
    .then((results: any) => {
      res.send({ ok: true, rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});
router.get('/listOth', (req, res, next) => {

  let db = req.dbHospData;

  model.libOth(db)
    .then((results: any) => {
      res.send({ ok: true, rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});
router.get('/listBuilding', (req, res, next) => {

  let db = req.dbHospData;

  model.libBuilding(db)
    .then((results: any) => {
      res.send({ ok: true, rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});
router.get('/listStrategic', (req, res, next) => {

  let db = req.dbHospData;
  
  model.libStrategic(db)
    .then((results: any) => {
      res.send({ ok: true, rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});
router.get('/listKpi', (req, res, next) => {

  let db = req.dbHospData;
  let fiscal_year = req.query.fiscal_year;
  model.libKpi(db,fiscal_year)
    .then((results: any) => {
      res.send({ ok: true, rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});
router.get('/listAdmin', (req, res, next) => {

  let db = req.dbHospData;
  let fiscal_year = req.query.fiscal_year;

  model.libAdmin(db,fiscal_year)
    .then((results: any) => {
      res.send({ ok: true, rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});

router.get('/listBudgetItem', (req, res, next) => {

  let db = req.dbHospData;

  model.libBudgetItem(db)
    .then((results: any) => {
      res.send({ ok: true, rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});

router.get('/listBudgetItemSelect', (req, res, next) => {

  let db = req.dbHospData;
  let item = req.query.item;

  model.libBudgetItemSelect(db,item)
    .then((results: any) => {
      res.send({ ok: true, rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});



export default router;
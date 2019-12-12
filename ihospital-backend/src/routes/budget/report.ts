'use strict';

import * as express from 'express';
import * as moment from 'moment';

import { ReportModel } from '../../models/budget/report';
import { LoginModel } from '../../models/login';
import { HospdataService } from '../../services/hospdata.service';

const router = express.Router();
const loginModel = new LoginModel();
const hospdataService = new HospdataService();
const today = moment().format('YYYY-MM-DD HH:mm:ss');
const model = new ReportModel();


router.get('/totalRequest', (req, res, next) => {

  let db = req.dbHospData;

  model.totalRequest(db)
    .then((results: any) => {
      res.send({ ok: true, rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});
router.get('/totalRequest61', (req, res, next) => {

  let db = req.dbHospData;

  model.totalRequest61(db)
    .then((results: any) => {
      res.send({ ok: true, rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});

router.get('/totalRequest61ByOffice', (req, res, next) => {

  let db = req.dbHospData;
  let department = req.query.department;

  model.totalRequest61ByOffice(db,department)
    .then((results: any) => {
      res.send({ ok: true, rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});

router.get('/totalRequestByOffice', (req, res, next) => {

  let db = req.dbHospData;
  let department = req.query.department;

  model.totalRequestByOffice(db,department)
    .then((results: any) => {
      res.send({ ok: true, rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});

router.get('/reportRequestGroupByOffice', (req, res, next) => {

  let db = req.dbHospData;
  let fiscal_year = req.query.fiscal_year;

  model.reportRequestGroupByOffice(db,fiscal_year)
    .then((results: any) => {
      res.send({ ok: true, rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});
router.get('/reportRequestGroupByItem', (req, res, next) => {

  let db = req.dbHospData;
  let fiscal_year = req.query.fiscal_year;

  model.reportRequestGroupByItem(db,fiscal_year)
    .then((results: any) => {
      res.send({ ok: true, rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});

router.get('/reportRequestDetailByOffice', (req, res, next) => {

  let db = req.dbHospData;
  let office = req.query.office;
  let fiscal_year = req.query.fiscal_year;

  model.reportRequestDetailByOffice(db,office,fiscal_year)
    .then((results: any) => {
      res.send({ ok: true, rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});

router.get('/reportRequestDetailByItem', (req, res, next) => {

  let db = req.dbHospData;
  let item = req.query.item;
  let fiscal_year = req.query.fiscal_year;

  model.reportRequestDetailByItem(db,item,fiscal_year)
    .then((results: any) => {
      res.send({ ok: true, rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});

router.get('/reportRequestDetailByOfficeNogroup', (req, res, next) => {

  let db = req.dbHospData;
  let office = req.query.office;
  let fiscal_year = req.query.fiscal_year;

  model.reportRequestDetailByOfficeNogroup(db,office,fiscal_year)
    .then((results: any) => {
      res.send({ ok: true, rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});

router.get('/reportUsedByItem', (req, res, next) => {

  let db = req.dbHospData;
  let fiscal_year = req.query.fiscal_year;

  model.reportUsedByItem(db,fiscal_year)
    .then((results: any) => {
      res.send({ ok: true, rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});

router.get('/reportUsedByOffice', (req, res, next) => {

  let db = req.dbHospData;
  let fiscal_year = req.query.fiscal_year;

  model.reportUsedByOffice(db,fiscal_year)
    .then((results: any) => {
      res.send({ ok: true, rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});

router.get('/listOT', (req, res, next) => {

  let db = req.dbHospData;
  let item = req.query.item;
  let fiscal_year = req.query.fiscal_year;

  model.listOT(db,item,fiscal_year)
    .then((results: any) => {
      res.send({ ok: true, rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});

router.get('/listProject', (req, res, next) => {

  let db = req.dbHospData;
  // let office = req.query.office;
  let fiscal_year = req.query.fiscal_year;
  model.listProject(db,fiscal_year)
    .then((results: any) => {
      res.send({ ok: true, rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});

router.get('/listAsset', (req, res, next) => {

  let db = req.dbHospData;
  let category = req.query.category;
  let fiscal_year = req.query.fiscal_year;

  model.listAsset(db,category,fiscal_year)
    .then((results: any) => {
      res.send({ ok: true, rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});

router.get('/listBuilding', (req, res, next) => {

  let db = req.dbHospData;
  let type = req.query.type;
  let fiscal_year = req.query.fiscal_year;

  model.listBuilding(db,type,fiscal_year)
    .then((results: any) => {
      res.send({ ok: true, rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});

router.get('/listPersonal', (req, res, next) => {

  let db = req.dbHospData;
  let fiscal_year = req.query.fiscal_year;

  model.listPersonal(db,fiscal_year)
    .then((results: any) => {
      res.send({ ok: true, rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});

router.get('/reportApproveByItem', (req, res, next) => {

  let db = req.dbHospData;
  let fiscal_year = req.query.fiscal_year;

  model.reportApproveByItem(db,fiscal_year)
    .then((results: any) => {
      res.send({ ok: true, rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});


export default router;
'use strict';

import * as express from 'express';
import * as moment from 'moment';

import { UsedModel } from '../../models/budget/used';
import { LoginModel } from '../../models/login';
import { HospdataService } from '../../services/hospdata.service';

const router = express.Router();
const loginModel = new LoginModel();
const hospdataService = new HospdataService();
const today = moment().format('YYYY-MM-DD HH:mm:ss');
const model = new UsedModel();

router.get('/listProjectByRef', (req, res, next) => {

  let db = req.dbHospData;
  let ref = req.query.ref;

  model.listProjectByRef(db,ref)
    .then((results: any) => {
      res.send({ ok: true, rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});

router.get('/listGeneral', (req, res, next) => {

  let db = req.dbHospData;
  let office = req.query.office;
  let fiscal_year = req.query.fiscal_year;

  model.listGeneral(db,office,fiscal_year)
    .then((results: any) => {
      res.send({ ok: true, rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});

router.get('/listFixasset', (req, res, next) => {

  let db = req.dbHospData;
  let office = req.query.office;
  let fiscal_year = req.query.fiscal_year;

  model.listFixasset(db,office,fiscal_year)
    .then((results: any) => {
      res.send({ ok: true, rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});

router.get('/listBuilding', (req, res, next) => {

  let db = req.dbHospData;
  let office = req.query.office;
  let fiscal_year = req.query.fiscal_year;

  model.listBuilding(db,office,fiscal_year)
    .then((results: any) => {
      res.send({ ok: true, rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});

router.get('/listProject', (req, res, next) => {

  let db = req.dbHospData;
  let office = req.query.office;
  let fiscal_year = req.query.fiscal_year;

  model.listProject(db,office,fiscal_year)
    .then((results: any) => {
      res.send({ ok: true, rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});

router.get('/listItemDetail', (req, res, next) => {

  let db = req.dbHospData;
  let ref = req.query.ref;
  let office = req.query.office;
  let type = req.query.type;
  let item = req.query.item;
  let fiscal_year = req.query.fiscal_year;

  model.listItemDetail(db,ref,office,type,item,fiscal_year)
    .then((results: any) => {
      res.send({ ok: true, rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});

router.get('/getPrevUsed', (req, res, next) => {

  let db = req.dbHospData;
  let no = req.query.no;
  let ref = req.query.ref;
  let office = req.query.office;
  let type = req.query.type;

  model.getPrevUsed(db,no,ref,office,type)
    .then((results: any) => {
      res.send({ ok: true, rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});

router.post('/', (req, res, next) => {
  let datas = req.body.data;
  let db = req.dbHospData;
  
    model.save(db, datas)
      .then((results: any) => {
        res.send({ ok: true })
      })
      .catch(error => {
      
        res.send({ ok: false, error: error })
      })
      .finally(() => {
        db.destroy();
      });
  
});


router.put('/:id', (req, res, next) => {
  let id = req.params.id;
  let datas = req.body.data;

  let db = req.dbHospData;

  if (id) {

    model.update(db, id, datas)
      .then((results: any) => {
        res.send({ ok: true })
      })
      .catch(error => {
        res.send({ ok: false, error: error })
      })
      .finally(() => {
        db.destroy();
      });
  } else {
    res.send({ ok: false, error: 'ข้อมูลไม่สมบูรณ์' }) ;
  }
});



router.get('/detail/:id', (req, res, next) => {
  let id = req.params.id;
  let db = req.dbHospData;

  model.detail(db, id)
    .then((results: any) => {
      res.send({ ok: true, detail: results[0] })
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    })
    .finally(() => {
      db.destroy();
    });
});

router.delete('/:id', (req, res, next) => {
  let id = req.params.id;
  let db = req.dbHospData;

  model.remove(db, id)
    .then((results: any) => {
      res.send({ ok: true })
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    })
    .finally(() => {
      db.destroy();
    });
});

export default router;
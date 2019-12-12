'use strict';

import * as express from 'express';
import * as moment from 'moment';

import { NmisKpiModel } from '../models/nmis-kpi';
import { LoginModel } from '../models/login';
import { HospdataService } from '../services/hospdata.service';

const router = express.Router();
const model = new NmisKpiModel();
const loginModel = new LoginModel();
const hospdataService = new HospdataService();
const today = moment().format('YYYY-MM-DD HH:mm:ss');

router.get('/listWard', (req, res, next) => {

  let db = req.dbHospData;

  model.listWard(db)
    .then((results: any) => {
      res.send({ ok: true, rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});

router.get('/listData', (req, res, next) => {

  let db = req.dbHospData;

  model.listData(db)
    .then((results: any) => {
      res.send({ ok: true, rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});

router.get('/listViewData', (req, res, next) => {

  let db = req.dbHospData;

  model.listViewData(db)
    .then((results: any) => {
      res.send({ ok: true, rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});

router.get('/listDataByOffice/:ward/:month/:year', (req, res, next) => {

  let db = req.dbHospData;
  let ward = req.params.ward;
  let month = req.params.month;
  let year = req.params.year;


  model.listDataByWard(db , ward,month,year)
    .then((results: any) => {
      res.send({ ok: true, rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});

router.get('/listKardexByOffice/:ward/:month/:year', (req, res, next) => {

  let db = req.dbHospData;
  let ward = req.params.ward;
  let month = req.params.month;
  let year = req.params.year;


  model.listKardexByWard(db , ward,month,year)
    .then((results: any) => {
      res.send({ ok: true, rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});

router.get('/listDataByDate/:month/:year', (req, res, next) => {

  let db = req.dbHospData;
  let month = req.params.month;
  let year = req.params.year;


  model.listDataByDate(db,month,year)
    .then((results: any) => {
      res.send({ ok: true, rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});

router.get('/listKardexByDate/:month/:year', (req, res, next) => {

  let db = req.dbHospData;
  let month = req.params.month;
  let year = req.params.year;


  model.listKardexByDate(db,month,year)
    .then((results: any) => {
      res.send({ ok: true, rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});

router.get('/listAllDataByYear/:office/:start/:end', (req, res, next) => {

  let db = req.dbHospData;
  let office = req.params.office;
  let start = req.params.start;
  let end = req.params.end;


  model.listAllDataByYear(db,office,start,end)
    .then((results: any) => {
      res.send({ ok: true, rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});

router.get('/listAllKardexByYear/:office/:start/:end', (req, res, next) => {

  let db = req.dbHospData;
  let office = req.params.office;
  let start = req.params.start;
  let end = req.params.end;


  model.listAllKardexByYear(db,office,start,end)
    .then((results: any) => {
      res.send({ ok: true, rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});

router.get('/listKardex', (req, res, next) => {

  let db = req.dbHospData;

  model.listKardex(db)
    .then((results: any) => {
      res.send({ ok: true, rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});

router.get('/listViewKardex', (req, res, next) => {

  let db = req.dbHospData;

  model.listViewKardex(db)
    .then((results: any) => {
      res.send({ ok: true, rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});



router.post('/saveData', (req, res, next) => {
  let datas = req.body.data;
  let db = req.dbHospData;

    model.saveData(db, datas)
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

router.post('/saveKardex', (req, res, next) => {
  let datas = req.body.data;
  let db = req.dbHospData;

    model.saveKardex(db, datas)
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



router.delete('/removeData/:id', (req, res, next) => {
  let id = req.params.id;
  let db = req.dbHospData;

  model.removeData(db, id)
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

router.delete('/removeKardex/:id', (req, res, next) => {
  let id = req.params.id;
  let db = req.dbHospData;

  model.removeKardex(db, id)
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

router.put('/updateData/:id', (req, res, next) => {
  let id = req.params.id;
  let datas = req.body.data;

  let db = req.dbHospData;

  if (id) {

    model.updateData(db, id, datas)
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

router.put('/updateKardex/:id', (req, res, next) => {
  let id = req.params.id;
  let datas = req.body.data;

  let db = req.dbHospData;

  if (id) {

    model.updateKardex(db, id, datas)
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

router.get('/listWardNodata/:month/:year', (req, res, next) => {

  let db = req.dbHospData;
  let month = req.params.month;
  let year = req.params.year;


  model.listWardNodata(db,month,year)
    .then((results: any) => {
      res.send({ ok: true, rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});

router.get('/listWardNokardex/:month/:year', (req, res, next) => {

  let db = req.dbHospData;
  let month = req.params.month;
  let year = req.params.year;


  model.listWardNokardex(db,month,year)
    .then((results: any) => {
      res.send({ ok: true, rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});

export default router;
'use strict';

import * as express from 'express';
import * as moment from 'moment';

import { PisTaskModel } from "../models/pis-task";

const router = express.Router();

const model = new PisTaskModel();

router.get('/listTaskOrder', (req, res, next) => {
 
  let db = req.db;
  let office = req.query.office;

  model.listTaskOrder(db,office)
    .then((results: any) => {
      res.send({ ok: true, rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});

router.get('/listTaskOrderQuery', (req, res, next) => {
 
  let db = req.db;
  let office = req.query.office;
  let q = req.query.q;
  let filter = req.query.filter;

  model.listTaskOrderQuery(db,office,q,filter)
    .then((results: any) => {
      res.send({ ok: true, rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});

router.get('/listEmployee', (req, res, next) => {
 
  let db = req.db;
  let office = req.query.office;

  model.listEmployee(db,office)
    .then((results: any) => {
      res.send({ ok: true, rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});

router.get('/listEmployeeReport', (req, res, next) => {
 
  let db = req.db;
  let office = req.query.office;
  let date_start = req.query.date_start;
  let date_end = req.query.date_end;

  model.listEmployeeReport(db,office,date_start,date_end)
    .then((results: any) => {
      res.send({ ok: true, rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});

router.get('/listOfficeReport', (req, res, next) => {
 
  let db = req.db;
  let office = req.query.office;
  let date_start = req.query.date_start;
  let date_end = req.query.date_end;

  model.listOfficeReport(db,office,date_start,date_end)
    .then((results: any) => {
      res.send({ ok: true, rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});

router.get('/listTaskOrderByItem', (req, res, next) => {
 
  let db = req.db;
  let ref = req.query.ref;

  model.listTaskOrderByItem(db,ref)
    .then((results: any) => {
      res.send({ ok: true, rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});

router.get('/listTaskOrderItem', (req, res, next) => {
 
  let db = req.db;
  let task = req.query.task;

  model.listTaskOrderItem(db,task)
    .then((results: any) => {
      res.send({ ok: true, rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});

router.get('/listTaskOrderItemAll', (req, res, next) => {
 
  let db = req.db;

  model.listTaskOrderItemAll(db)
    .then((results: any) => {
      res.send({ ok: true, rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});

router.get('/listOffice', (req, res, next) => {
 
  let db = req.db;

  model.listOffice(db)
    .then((results: any) => {
      res.send({ ok: true, rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});

router.get('/listJobType', (req, res, next) => {
 
  let db = req.db;

  model.listJobType(db)
    .then((results: any) => {
      res.send({ ok: true, rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});

router.get('/listJobLocation', (req, res, next) => {
 
  let db = req.db;

  model.listJobLocation(db)
    .then((results: any) => {
      res.send({ ok: true, rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});

router.get('/listRisk', (req, res, next) => {
 
  let db = req.db;
  let group = req.query.group;

  model.listRisk(db,group)
    .then((results: any) => {
      res.send({ ok: true, rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});

router.get('/listRiskType', (req, res, next) => {
 
  let db = req.db;
  let ref_risk = req.query.ref_risk;
  model.listRiskType(db,ref_risk)
    .then((results: any) => {
      res.send({ ok: true, rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});

router.get('/listRiskDetail', (req, res, next) => {
 
  let db = req.db;
  let ref_risk = req.query.ref_risk;
  let ref_type = req.query.ref_type;
  model.listRiskDetail(db,ref_risk,ref_type)
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

router.post('/saveItem', (req, res, next) => {
  let datas = req.body.data;
  let db = req.dbHospData;

    model.saveItem(db, datas)
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

router.put('/updateItem/:id', (req, res, next) => {
  let id = req.params.id;
  let datas = req.body.data;
  let db = req.dbHospData;

  if (id) {
    model.updateItem(db, id, datas)
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
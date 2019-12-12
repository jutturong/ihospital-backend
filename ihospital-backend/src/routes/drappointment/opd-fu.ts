import { OpdFuModel } from './../../models/drappointment/opd-fu';
'use strict';
import * as express from 'express';
import * as fse from 'fs-extra';
import * as wrap from 'co-express';
import { locale } from 'moment';
import * as moment from 'moment';

const router = express.Router();
const model = new OpdFuModel();

router.get('/listAppointment', (req, res, next) => {
  let db = req.db;
  model.listAppointment(db)
    .then((results: any) => {
      res.send({rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});

router.get('/appointmentByVn', (req, res, next) => {
  let vn = req.query.vn;
  let fu_date = req.query.fu_date;
  let db = req.db;
  console.log(vn);
  model.appointmentByVn(db, vn, fu_date)
    .then((result: any) => {
      res.send({row: result})
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    })
    .finally(() => {
      db.destroy();
    });
});

router.post('/', (req, res, next) => {
  let datas = req.body.data;
  let db = req.db;
  model.save(db, datas)
    .then((results: any) => {
      res.send({ ok: true, req_id: results });
    });

  model.getCurrentCounter(db, 1).then((result: any) => {
    let currentCounter = result[0].counter;
    let counter = result[0].counter + 1;
    let data = { 'counter': counter };

    model.updateCounter(db, 1, data).then((result: any) => {
      console.log(result)
    });

  }).catch(error => {
    res.send({ ok: false, error: error })
  })
    .finally(() => {
      db.destroy();
    });
});

router.put('/:req_id', (req, res, next) => {
  let ref = req.params.req_id;
  let datas = req.body.data;
  let db = req.db;
  if (ref) {
    model.update(db, ref, datas)
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

router.get('/detail/:req_id', (req, res, next) => {
  let req_id = req.params.req_id;
  let db = req.db;
  model.detail(db, req_id)
    .then((results: any) => {
      let arRequestItems: Array<any> = [];
      res.send({ ok: true, detail: results['0'], arRequestItems: results })
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    })
    .finally(() => {
      db.destroy();
    });
});

router.get('/detail-request/:req_id', (req, res, next) => {
  let req_id = req.params.req_id;
  let db = req.db;
  model.detailRequest(db, req_id)
    .then((results: any) => {
      res.send({ ok: true, rows: results })
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    })
    .finally(() => {
      db.destroy();
    });
});

router.get('/view/:req_id', (req, res, next) => {
  let req_id = req.params.req_id;
  let db = req.db;
  model.viewBloodRequest(db, req_id)
    .then((results: any) => {
      res.send({ ok: true, rows: results })
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    })
    .finally(() => {
      db.destroy();
    });
});

router.delete('/:req_id', (req, res, next) => {
  let req_id = req.params.req_id;
  let db = req.db;
  model.remove(db, req_id)
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
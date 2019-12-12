'use strict';
import * as express from 'express';
import * as fse from 'fs-extra';
import * as wrap from 'co-express';
import { locale } from 'moment';
import * as moment from 'moment';
import { DataPatientModel } from './../../models/cancer/data-patient';

const router = express.Router();
const model = new DataPatientModel();

router.get('/', (req, res, next) => {
  let db = req.db;
  model.list(db)
    .then((results: any) => {
      res.send({ rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});

router.get('/detail/:hn', (req, res, next) => {
  let hn = req.params.hn;
  let db = req.db;
  model.getDataPatientByHn(db, hn)
    .then((results: any) => {
      res.send(results[0])
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    })
});

router.get('/:fk', (req, res, next) => {
  let fk = req.params.fk;
  let db = req.db;
  model.getPatient(db, fk)
    .then((result: any) => {
      res.send(result[0])
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    })
});

// router.get('/:fk', (req, res, next) => {
//   let fk = req.params.fk;
//   let db = req.db;
//   model.getPatientCancerNew(db, fk)
//     .then((result: any) => {
//       res.send(result[0])
//     })
//     .catch(error => {
//       res.send({ ok: false, error: error })
//     })
// });

router.post('/', (req, res, next) => {
  let data = req.body.data;
  let db = req.db;
  model.save(db, data)
    .then((result: any) => {
      res.send(result);
    })
    .finally(() => {
      db.destroy();
    });
});

router.put('/:patient_id', (req, res, next) => {
  let patient_id = req.params.patient_id;
  let data = req.body.data;
  let db = req.db;
  if (patient_id) {
    model.update(db, patient_id, data)
      .then((result: any) => {
        res.send({ ok: true, id: patient_id})
      })
      .catch(error => {
        res.send({ ok: false, error: error })
      })
      .finally(() => {
        db.destroy();
      });
  } else {
    res.send({ ok: false, error: 'ข้อมูลไม่สมบูรณ์' });
  }
});

router.get('/checkPtAlready/:hn', (req, res, next) => {
  let hn = req.params.hn;
  let db = req.db;
  model.getPtAlready(db, hn)
    .then((result: any) => {
      res.send(result[0])
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    })
    .finally(() => {
      db.destroy();
    });
});

router.get('/getPtNew/:hn', (req, res, next) => {
  let hn = req.params.hn;
  let db = req.db;
  model.getPtNew(db, hn)
    .then((result: any) => {
      res.send(result[0])
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    })
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
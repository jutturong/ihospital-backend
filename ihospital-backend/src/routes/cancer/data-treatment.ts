'use strict';
import * as express from 'express';
import * as fse from 'fs-extra';
import * as wrap from 'co-express';
import { locale } from 'moment';
import * as moment from 'moment';
import { DataTreatmentModel } from './../../models/cancer/data-treatment';

const router = express.Router();
const model = new DataTreatmentModel();

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

router.get('/get-patient-trt/:hn', (req, res, next) => {
  let hn = req.params.hn;
  let db = req.db;
  model.getPatientTrt(db, hn)
    .then((results: any) => {
      res.send({ results })
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    })
});

router.get('/get-patient-trt-his/:hn', (req, res, next) => {
  let hn = req.params.hn;
  let db = req.db;
  model.getPatientTrt(db, hn)
    .then((results: any) => {
      res.send({rows: results })
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    })
});

router.get('/get-data-trt/:cancerId', (req, res, next) => {
  let cancerId = req.params.cancerId;
  let db = req.db;
  model.getDataTrt(db, cancerId)
    .then((results: any) => {
      res.send(results)
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    })
});

router.get('/:treatment_id', (req, res, next) => {  
  let treatment_id = req.params.treatment_id;
  let db = req.db;
  model.getDataTrtById(db, treatment_id)
    .then((result: any) => {
     res.send({ ok: true, row: result[0] })
   })
   .catch(error => {
     res.send({ ok: false, error: error })
   })
});

router.post('/', (req, res, next) => {
  let data = req.body.data;
  let db = req.db;  
  model.save(db, data)
    .then((result: any) => {
      res.send({ ok: true, result: result});
    }).catch(error => {
      res.send({ ok: false, error: error })
    })
    .finally(() => {
      db.destroy();
    });
});

router.put('/:treatment_id', (req, res, next) => {
  let treatment_id = req.params.treatment_id;
  let data = req.body.data;
  let db = req.db;
  if (treatment_id) {
    model.update(db, treatment_id, data)
      .then((result: any) => {
        res.send({ ok: true, row: result })
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

// router.get('/detail/:req_id', (req, res, next) => {
//   let req_id = req.params.req_id;
//   let db = req.db;
//   model.detail(db, req_id)
//     .then((results: any) => {
//       let arRequestItems: Array<any> = [];
//       res.send({ ok: true, detail: results['0'], arRequestItems: results })
//     })
//     .catch(error => {
//       res.send({ ok: false, error: error })
//     })
//     .finally(() => {
//       db.destroy();
//     });
// });

// router.get('/detail-request/:req_id', (req, res, next) => {
//   let req_id = req.params.req_id;
//   let db = req.db;
//   model.detailRequest(db, req_id)
//     .then((results: any) => {
//       res.send({ ok: true, rows: results })
//     })
//     .catch(error => {
//       res.send({ ok: false, error: error })
//     })
//     .finally(() => {
//       db.destroy();
//     });
// });

// router.get('/view/:req_id', (req, res, next) => {
//   let req_id = req.params.req_id;
//   let db = req.db;
//   model.viewBloodRequest(db, req_id)
//     .then((results: any) => {
//       res.send({ ok: true, rows: results })
//     })
//     .catch(error => {
//       res.send({ ok: false, error: error })
//     })
//     .finally(() => {
//       db.destroy();
//     });
// });

router.delete('/:treatment_id', (req, res, next) => {
  let treatment_id = req.params.treatment_id;
  let db = req.db;
  model.remove(db, treatment_id)
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
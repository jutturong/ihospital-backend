'use strict';
import * as express from 'express';
import * as fse from 'fs-extra';
import * as wrap from 'co-express';
import { locale } from 'moment';
import * as moment from 'moment';
import { RequestModel } from '../../models/bloodbank/request';

const router = express.Router();
const model = new RequestModel();
router.get('/', (req, res, next) => {
  let db = req.db;
  model.list(db)
    .then((results: any) => {
      res.send({rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});

router.get('/:an', (req, res, next) => {
  let an = req.params.an;
  let db = req.db;
  model.listByFk(db, an)
    .then((results: any) => {
      res.send({rows: results })
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

// router.get('/tempAutoNumber/:temp', (req, res, next) => {
//   let arTempAutoNumber: Array<any> = [];
//   let db = req.db;
//   let ref = req.params.temp;
//   modelTempAutoNumber.listById(db).then((result: any) => {
//     res.send({ ok: true, row: result })
//   });
// })

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
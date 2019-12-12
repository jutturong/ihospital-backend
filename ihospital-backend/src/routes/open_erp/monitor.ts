'use strict';

import * as express from 'express';
import * as moment from 'moment';
import * as HttpStatus from 'http-status-codes';
import { MonitorModel } from '../../models/open_erp/monitor';

const router = express.Router();
const monitorModel = new MonitorModel();

router.get('/aspirator', (req, res, next) => {
    let db = req.db;
    monitorModel.getAspirator(db)
      .then((results: any) => {
        res.send({ rows: results });
      })
      .catch(error => {
        res.send({ ok: false, error: error })
      });
  });

  router.get('/aspirator/status/:status', (req, res, next) => {
    let db = req.db;
    let status = req.params.status;

    monitorModel.getAspiratorByStatus(db, status)
      .then((results: any) => {
        res.send({ rows: results });
      })
      .catch(error => {
        res.send({ ok: false, error: error })
      });
  });

  router.get('/aspiratorSelected/:chk', (req, res, next) => {
    let db = req.db;
    let chk = req.params.chk;
    monitorModel.getAspiratorSelected(db, chk)
      .then((results: any) => {
        res.send({ rows: results });
      })
      .catch(error => {
        res.send({ ok: false, error: error })
      });
  });

router.get('/aspirator-detail/:id', (req, res, next) => {
    let db = req.db;
    let id = req.params.id;
    monitorModel.aspiratorDetail(db, id)
      .then((result: any) => {
        res.send({ row: result[0] });
      })
      .catch(error => {
        res.send({ ok: false, error: error })
      });
  });

  router.post('/', (req, res, next) => {
    let data = req.body.data;
    let db = req.db;  
    monitorModel.save(db, data)
      .then((result: any) => {
        res.send({ ok: true, result: result});
      }).catch(error => {
        res.send({ ok: false, error: error })
      })
      .finally(() => {
        db.destroy();
      });
  });

  router.put('/durable/:id', (req, res, next) => {
    let id = req.params.id;
    let data = req.body.data;
    let db = req.db;
    if (id) {
      monitorModel.update(db, id, data)
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
        res.send({ ok: false, error: 'ข้อมูลไม่สมบูรณ์' });
    }
});

  

export default router;
'use strict';

import * as express from 'express';
import * as moment from 'moment';

import { UserinfoModel } from "../models/userinfo";

const router = express.Router();

const model = new UserinfoModel();


/*
router.get('/', (req, res, next) => {
 
  let db = req.db;
  let q = req.query.q;
  let filterBy = req.query.filterby;

  model.list(db,q,filterBy)
    .then((results: any) => {
      res.send({ ok: true, rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});
*/

router.get('/', (req, res, next) => {
 
  let db = req.db;
  let ssn = req.params.ssn;
  let filterBy = req.query.filterby;



  model.list(db,ssn,filterBy)
    .then((results: any) => {
      res.send({ ok: true, rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });

});


router.get('/:ssn', (req, res, next) => {
 
  let db = req.db;
  let ssn = req.params.ssn;
  let filterBy = req.query.filterby;

  model.list(db,ssn,filterBy)
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

/*
http://10.3.42.21:3008/usertimelog
body,raw,JSON
    {
        "data":{
            "id_user":"145",
            "place_location":"1",
            "area_status":"1",
            "time_stamp_work":"2019-10-28 11:50:10",
            "type_in_time":"1",
            "type_go_to_work":"1",
            "type_time_stamp":"1",
            "type_work_state":"1",
            "timelog":"2019-10-28 12:50:40"
        }
    
    }
*/


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

/*
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
*/


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
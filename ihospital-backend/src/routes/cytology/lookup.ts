'use strict';

import * as express from 'express';
import * as moment from 'moment';

import { LookupModel } from '../../models/cytology/lookup';
import { LoginModel } from '../../models/login';
import { HospdataService } from '../../services/hospdata.service';

const router = express.Router();
const loginModel = new LoginModel();
const hospdataService = new HospdataService();
const today = moment().format('YYYY-MM-DD HH:mm:ss');
const model = new LookupModel();

router.get('/cytotype', (req, res, next) => {

  let db = req.dbHospData;

  model.listCyto_type(db)
    .then((results: any) => {
      res.send({ ok: true, rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});

router.get('/smeartype', (req, res, next) => {
  
    let db = req.dbHospData;
  
    model.listSmear_type(db)
      .then((results: any) => {
        res.send({ ok: true, rows: results });
      })
      .catch(error => {
        res.send({ ok: false, error: error })
      });
  });

  router.get('/specimen', (req, res, next) => {
    
      let db = req.dbHospData;
    
      model.listSpecimen(db)
        .then((results: any) => {
          res.send({ ok: true, rows: results });
        })
        .catch(error => {
          res.send({ ok: false, error: error })
        });
    });

  router.get('/adequacy', (req, res, next) => {
    
      let db = req.dbHospData;
    
      model.listAdequacy(db)
        .then((results: any) => {
          res.send({ ok: true, rows: results });
        })
        .catch(error => {
          res.send({ ok: false, error: error })
        });
    });

  router.get('/aspecimen', (req, res, next) => {
    
      let db = req.dbHospData;
    
      model.listAspecimen(db)
        .then((results: any) => {
          res.send({ ok: true, rows: results });
        })
        .catch(error => {
          res.send({ ok: false, error: error })
        });
    });

  router.get('/adequacy_parent', (req, res, next) => {
    
      let db = req.dbHospData;
    
      model.listAdequacy_parent(db)
        .then((results: any) => {
          res.send({ ok: true, rows: results });
        })
        .catch(error => {
          res.send({ ok: false, error: error })
        });
    });

  router.get('/cytist', (req, res, next) => {
    
      let db = req.dbHospData;
    
      model.listCytist(db)
        .then((results: any) => {
          res.send({ ok: true, rows: results });
        })
        .catch(error => {
          res.send({ ok: false, error: error })
        });
    });

  router.get('/result', (req, res, next) => {
    
      let db = req.dbHospData;
    
      model.listResult(db)
        .then((results: any) => {
          res.send({ ok: true, rows: results });
        })
        .catch(error => {
          res.send({ ok: false, error: error })
        });
    });
  
  


export default router;
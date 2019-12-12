'use strict';

import * as express from 'express';
import * as moment from 'moment';

import { RiskreportModel } from '../models/risk-report';
import { LoginModel } from '../models/login';
import { HospdataService } from '../services/hospdata.service';

const router = express.Router();
const riskreportModel = new RiskreportModel();
const loginModel = new LoginModel();
const hospdataService = new HospdataService();
const today = moment().format('YYYY-MM-DD HH:mm:ss');


router.get('/alldata', (req, res, next) => {

  let db = req.dbHospData;

  riskreportModel.list(db)
    .then((results: any) => {
      res.send({ ok: true, rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});


router.get('/amountBymonthClinic/:startdate/:enddate', (req, res, next) => {
  
  let db = req.dbHospData;
    //รับตัวแปรเพิ่ม
    let startdate = req.params.startdate;
    let enddate = req.params.enddate;
  
    riskreportModel.amountBymonthClinic(db,startdate,enddate)
      .then((results: any) => {
        res.send({ ok: true, rows: results });
      })
      .catch(error => {
        res.send({ ok: false, error: error })
      });
  });

  router.get('/amountBymonthNonclinic/:startdate/:enddate', (req, res, next) => {
    
    let db = req.dbHospData;
      //รับตัวแปรเพิ่ม
      let startdate = req.params.startdate;
      let enddate = req.params.enddate;
    
      riskreportModel.amountBymonthNonclinic(db,startdate,enddate)
        .then((results: any) => {
          res.send({ ok: true, rows: results });
        })
        .catch(error => {
          res.send({ ok: false, error: error })
        });
    });

  router.get('/amountByOfficeClinic/:startdate/:enddate', (req, res, next) => {
    
    let db = req.dbHospData;
      //รับตัวแปรเพิ่ม
      let startdate = req.params.startdate;
      let enddate = req.params.enddate;
    
      riskreportModel.amountByOfficeClinic(db,startdate,enddate)
        .then((results: any) => {
          res.send({ ok: true, rows: results });
        })
        .catch(error => {
          res.send({ ok: false, error: error })
        });
    });

  router.get('/amountByOfficeNonclinic/:startdate/:enddate', (req, res, next) => {
    
    let db = req.dbHospData;
      //รับตัวแปรเพิ่ม
      let startdate = req.params.startdate;
      let enddate = req.params.enddate;
    
      riskreportModel.amountByOfficeNonclinic(db,startdate,enddate)
        .then((results: any) => {
          res.send({ ok: true, rows: results });
        })
        .catch(error => {
          res.send({ ok: false, error: error })
        });
    });

export default router;
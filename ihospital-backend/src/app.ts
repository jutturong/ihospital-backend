'use strict';
/// <reference path="../typings.d.ts" />
require('dotenv').config();

import { Router, Request, Response, NextFunction } from 'express';
import * as express from 'express';
import * as path from 'path';
import * as favicon from 'serve-favicon';
import * as logger from 'morgan';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as HttpStatus from 'http-status-codes';

import Knex = require('knex');
import { MySqlConnectionConfig } from 'knex';

import { Jwt } from './models/jwt';
const jwt = new Jwt();
var fs = require('fs');

import indexRoute from './routes';
import mainRoute from './routes/main';
import loginRoute from './routes/login';
import hosdataRoute from './routes/hospdata';
import hosdataReportRoute from './routes/hospdata_report';
import ancRoute from './routes/anc';
import chartfilingRoute from './routes/chartfiling';
import opsRoute from './routes/ops';
import utilsRoute from './routes/utils';
import reportDrRoute from './routes/report_dr';
import riskreportRoute from './routes/risk-report';
import instrumentRoute from './routes/healthassurance/instrument';
import employeeRoute from './routes/employee';
import timeAttendanceRoute from './routes/time-attendance';
import payrollRoute from './routes/payroll';
import ipdRoute from './routes/ipd';
import opdRoute from './routes/opd';
import auditRoute from './routes/audit';
import nmiskpiRoute from './routes/nmis-kpi';
import inpectionRoute from './routes/inspection';
import labRoute from './routes/lab';
import cytoinRoute from './routes/cytology/cyto-in';
import lookupRoute from './routes/cytology/lookup';
import patientRoute from './routes/cytology/patient';
import xrayRoute from './routes/xray';
import claimRoute from './routes/claim';
import payplanRoute from './routes/payplan';
import libRoute from './routes/lib';
// import kpiRoute from './routes/kpi/kpi';
import serviceRoute from './routes/service/index';

import drugRoute from './routes/drug/drug';

import openerpRoute from './routes/open_erp/index';
import openerpServiceRoute from './routes/open_erp/service';
import openerpDurableRoute from './routes/open_erp/durable';

/*------bloodbank-----*/
import requestRoute from './routes/bloodbank/request';
import requestItemRoute from './routes/bloodbank/request-item';
import crossmatchRoute from './routes/bloodbank/crossmatch';
import paybackRoute from './routes/bloodbank/payback';
import groupingRoute from './routes/bloodbank/grouping';
import libSpecimenRoute from './routes/bloodbank/lib-specimen';
import qualityRoute from './routes/bloodbank/lib-quality';
import requestForRoute from './routes/bloodbank/lib-request-for';
import requirmentRoute from './routes/bloodbank/lib-requirment';
import labtestRoute from './routes/bloodbank/lib-labtest';
import labCrossRoute from './routes/bloodbank/labcross';
import specimenRoute from './routes/bloodbank/specimen';
import libEmpRoute from './routes/bloodbank/lib-emp';
import templateAutonumberRoute from './routes/bloodbank/template-autonumber';
import templateAutonumberGroupRoute from './routes/bloodbank/template-autonumber-group';
/*-------------------*/

/*-----Cancer-----*/
import dataPatientRoute from './routes/cancer/data-patient';
import dataCancerRoute from './routes/cancer/data-cancer';
import dataTreatmentRoute from './routes/cancer/data-treatment';
import LibDataRoute from './routes/cancer/lib-data';
/*-------------------*/

/*-----Monitor-----*/
import monitorRoute from './routes/open_erp/monitor';
import equipmentRout from './routes/open_erp/equipment';
import tranRoute from './routes/open_erp/tran'
import bookRoute from './routes/open_erp/book'
import equipmentLibRoute from './routes/open_erp/equipment-lib'

/*-------------------*/

/* DR-Appointment*/
import opdFulRoute from './routes/drappointment/opd-fu';
/*-------------------*/

/*-----Budget-----*/
import assetRoute from './routes/budget/asset';
import personRoute from './routes/budget/person';
import generalRoute from './routes/budget/general';
import operateRoute from './routes/budget/operate';
import otRoute from './routes/budget/ot';
import trainingRoute from './routes/budget/training';
import projectRoute from './routes/budget/project';
import buildingModel from './routes/budget/building';
import lookupBudgetRoute from './routes/budget/lookup';
import budgetReportRoute from './routes/budget/report';
import approveRoute from './routes/budget/approve';
import usedRoute from './routes/budget/used';
/*-------------------*/

/*-----Donate-----*/
import donateRoute from './routes/donate';

/*--------apptime-----------*/
import apptimeRoute from './routes/apptime';
import hiptimeRoute from  './routes/hiptime';
 import usertimelog from './routes/usertimelog';
 import userinfo from './routes/userinfo';
 import checkinout from './routes/checkinout';
/*--------apptime-----------*/

/*-----OrganDonate-----*/
import OrganRoute from './routes/organ';

/*-----PIS TASK-----*/
import PisTaskRoute from './routes/pis-task';

/*-----CLAIMREC-----*/
import claimRecFileRoute from './routes/claimrec/upload';
import claimRecRoute from './routes/claimrec/claimrec';

/*-----KPI-----*/
import kpiRoute from './routes/kpi/kpi';
import kpiReportRoute from './routes/kpi/report';

const app: express.Express = express();

//view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname,'public','favicon.ico')));
app.use(logger('dev'));

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

/*
  ตรวจสอบ token
*/
// let checkAuth = (req: Request, res: Response, next: NextFunction) => {
let checkAuth = (req, res: Response, next: NextFunction) => {
  let token: string = null;

  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.body && req.body.token) {
    token = req.body.token;
  }

  jwt.verify(token)
    .then((decoded: any) => {
      req.decoded = decoded;    // กรณี decode ได้
      next();
    }, err => {
      console.log('>>> token fail:', err.message);
      return res.status(HttpStatus.UNAUTHORIZED).send({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: HttpStatus.getStatusText(HttpStatus.UNAUTHORIZED),
        ok: false
      });
    });
}

let monitoring = (req, res: Response, next: NextFunction) => {
  console.log(req.ip, req.url);
  next();
}

// var configAPI: any = {API: []};
fs.readFile(__dirname + '/assets/configs/.config', 'utf8', function (req, err, contents) {
  if (contents) {
    req.configAPI = JSON.parse(contents);
    // console.log(configAPI.API[0].dbConfig);
  } else {
    // console.log(err);
  }
});

let hospdataConnectionConfig: MySqlConnectionConfig = {
  host: process.env.DB1_HOST,
  port: process.env.DB1_PORT,
  user: process.env.DB1_USER,
  password: process.env.DB1_PASSWORD,
  database: process.env.DB1_NAME,
  dateStrings: true
}

let referConnectionConfig: MySqlConnectionConfig = {
  host: process.env.DB2_HOST,
  port: process.env.DB2_PORT,
  user: process.env.DB2_USER,
  password: process.env.DB2_PASSWORD,
  database: process.env.DB2_NAME
}

// Drug connection option =========================================
const drugConnectionOption = createConnectionOption({
  client: process.env.DRUG_DB_CLIENT,
  host: process.env.DRUG_DB_HOST,
  user: process.env.DRUG_DB_USER,
  password: process.env.DRUG_DB_PASSWORD,
  dbName: process.env.DRUG_DB_NAME,
  port: process.env.DRUG_DB_PORT,
  schema: process.env.DRUG_DB_SCHEMA,
  charSet: process.env.DRUG_DB_CHARSET,
  encrypt: process.env.DRUG_DB_ENCRYPT || true
});

// create connection =========================================
app.use((req, res, next) => {
  req.dbHospData = Knex({
    client: 'mysql',
    connection: hospdataConnectionConfig,
    pool: {
      min: 0,
      max: 7,
      afterCreate: (conn, done) => {
        conn.query('SET NAMES utf8', (err) => {
          done(err, conn);
        });
      }
    },
    debug: true,
    acquireConnectionTimeout: 5000
  });
  req.db = req.dbHospData;

  req.dbDrug = Knex(drugConnectionOption);

  req.dbBM = Knex({
    client: 'mysql',
    connection: hospdataConnectionConfig,
    pool: {
      min: 0,
      max: 7,
      afterCreate: (conn, done) => {
        conn.query('SET NAMES utf8', (err) => {
          done(err, conn);
        });
      }
    },
    debug: false,
    acquireConnectionTimeout: 5000
  });


  req.dbContract = Knex({
    client: 'mysql',
    connection: referConnectionConfig,
    pool: { min: 0, max: 10 }
  });

  next();
});

app.use('/login', loginRoute);
app.use('/main', monitoring, checkAuth, mainRoute);
app.use('/opd', monitoring, checkAuth, opdRoute);
app.use('/ipd', monitoring, checkAuth, ipdRoute);
app.use('/drug', checkAuth, drugRoute);
// app.use('/kpi', checkAuth, kpiRoute);
app.use('/service', serviceRoute);

app.use('/claim', monitoring, claimRoute);
app.use('/payplan', payplanRoute);
app.use('/data', monitoring, checkAuth, hosdataRoute);
app.use('/data/reports', monitoring, checkAuth, hosdataReportRoute);
app.use('/anc', ancRoute);
app.use('/lib', monitoring, checkAuth, libRoute);
app.use('/chart', chartfilingRoute);
app.use('/ops', opsRoute);
app.use('/utils', utilsRoute);
app.use('/report-dr', reportDrRoute);
app.use('/report-risk', riskreportRoute);
app.use('/instrument', instrumentRoute);
app.use('/nmis-kpi', nmiskpiRoute);
app.use('/employee', checkAuth, employeeRoute);
app.use('/time-attendance', checkAuth, timeAttendanceRoute);
app.use('/payroll', monitoring, checkAuth, payrollRoute);
app.use('/audit', auditRoute);
app.use('/inspection', inpectionRoute);
app.use('/lab', monitoring, checkAuth, labRoute);
app.use('/cyto-in', cytoinRoute);
app.use('/lookup', lookupRoute);
app.use('/patient', patientRoute);
app.use('/xray', xrayRoute);
app.use('/openerp', openerpRoute);
app.use('/openerp/service', openerpServiceRoute);
app.use('/openerp/durable', monitoring, checkAuth, openerpDurableRoute);

/*------bloodbank-----*/
app.use('/bloodbank/request', requestRoute);
app.use('/bloodbank/request-item', requestItemRoute);
app.use('/bloodbank/crossmatch', crossmatchRoute);
app.use('/bloodbank/payback', paybackRoute);
app.use('/bloodbank/grouping', groupingRoute);
app.use('/bloodbank/lib-specimen', libSpecimenRoute);
app.use('/bloodbank/lib-quality', qualityRoute);
app.use('/bloodbank/lib-requirment', requirmentRoute);
app.use('/bloodbank/lib-request-for', requestForRoute);
app.use('/bloodbank/lib-labtest', labtestRoute);
app.use('/bloodbank/lib-emp', libEmpRoute);
app.use('/bloodbank/labcross', labCrossRoute);
app.use('/bloodbank/specimen', specimenRoute);
app.use('/bloodbank/template-autonumber', templateAutonumberRoute);
app.use('/bloodbank/template-autonumber-group', templateAutonumberGroupRoute);
/*-------------------*/

/*------Cancer-----*/
app.use('/cancer/data-patient', dataPatientRoute);
app.use('/cancer/data-cancer', dataCancerRoute);
app.use('/cancer/data-treatment', dataTreatmentRoute);
app.use('/cancer/lib-data', LibDataRoute);
/*-------------------*/

/*------Openerp-----*/
app.use('/openerp/equipment', equipmentRout);
app.use('/openerp/monitor', monitorRoute);
app.use('/openerp/book', bookRoute);
app.use('/openerp/tran', tranRoute);
app.use('/openerp/equipment-lib', equipmentLibRoute)

/*-------------------*/

/*------Dr-Appointment-----*/
app.use('/drappointment/opd-fu', opdFulRoute);
/*-------------------*/

/*------Budget-----*/
app.use('/budget/asset', assetRoute);
app.use('/budget/person', personRoute);
app.use('/budget/general', generalRoute);
app.use('/budget/operate', operateRoute);
app.use('/budget/ot', otRoute);
app.use('/budget/training', trainingRoute);
app.use('/budget/project', projectRoute);
app.use('/budget/building', buildingModel);
app.use('/budget/lookup', lookupBudgetRoute);
app.use('/budget/report', budgetReportRoute);
app.use('/budget/approve', approveRoute);
app.use('/budget/used', usedRoute);
/*-------------------*/

/*------Donate-----*/
app.use('/donate/donate', donateRoute);
/*-------------------*/

/*--------apptime--------*/
app.use('/apptime/', apptimeRoute);
app.use('/hiptime/',hiptimeRoute);
app.use('/usertimelog/',usertimelog);
app.use('/userinfo',userinfo);
app.use('/checkinout',checkinout);
/*--------apptime--------*/

/*------OrganDonate-----*/
app.use('/organ', OrganRoute);
/*-------------------*/

/*------PIS TASK-----*/
app.use('/pis-task/pis-task', monitoring, PisTaskRoute);
/*-------------------*/

/*------Claim Rec-----*/
app.use('/claimrec/file', claimRecFileRoute);
app.use('/claimrec', claimRecRoute);
/*-------------------*/

/*------KPI-----*/
app.use('/kpi', checkAuth, kpiRoute);
app.use('/kpi-report', checkAuth, kpiReportRoute);
/*-------------------*/

app.use('/', monitoring, indexRoute);

//catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error('Not Found');
  err['status'] = 404;
  next(err);
});

app.use((err: Error, req, res, next) => {
  res.status(err['status'] || 500);
  res.send({ status: err['status'], ok: false, error: err });
  console.log(err);
});

function createConnectionOption(db: any) {
  if (db.client === 'mssql') {
    return {
      client: db.client,
      connection: {
        server: db.host,
        user: db.user,
        password: db.password,
        database: db.dbName,
        encrypt: db.encrypt,
        options: {
          port: +db.port,
          schema: db.schema
        }
      }
    };
  } else {
    return {
      client: db.client,
      connection: {
        host: db.host,
        port: +db.port,
        user: db.user,
        password: db.password,
        database: db.dbName,
      },
      pool: {
        min: 0,
        max: 7,
        afterCreate: (conn, done) => {
          conn.query('SET NAMES ' + db.charSet, (err) => {
            done(err, conn);
          });
        }
      },
      debug: false,
    };
  }

}

export default app;

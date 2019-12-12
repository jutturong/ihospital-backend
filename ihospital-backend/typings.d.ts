
import express = require('express');
import Knex = require('knex');

declare global {
  namespace Express {
    export interface Request {
      dbHospData: Knex;
      dbBM: Knex;
      dbRisk: Knex;
      db: Knex;
      dbDrug: Knex;
      dbContract: Knex;
      decoded: any;
      configAPI: any;
      file:any;
    }
  }
}
'use strict';
import * as express from 'express';
import * as moment from 'moment';
import * as fse from 'fs-extra';
import * as path from 'path';
import * as fs from 'fs';
import * as rimraf from 'rimraf';
import * as Random from 'random-js';
import * as gulp from 'gulp';
import * as gulpData from 'gulp-data';
import * as gulpPug from 'gulp-pug';
import * as pdf from 'html-pdf';
import * as json2xls from 'json2xls';
import * as wrap from 'co-express';
import * as numeral from 'numeral';
import { HospdataModel } from '../models/hospdata';
import { PharmacyModel } from '../models/pharmacy';

const hospdataModel = new HospdataModel();
const pharmacyModel = new PharmacyModel();
const router = express.Router();

router.get('/opd-drug-list/:vn', wrap(async (req, res, next) => {
  let db = req.dbHospData;
  let vn = req.params.vn;
  let json: any = {};

  if (vn) {
    try {

      fse.ensureDirSync(process.env.HTML_PATH);
      fse.ensureDirSync(process.env.PDF_PATH);
      let r = new Random();
      let rndPath = r.uuid4(Random.engines.mt19937().seedWithArray([0x12345678, 0x90abcdef]));
      const dstHTMLPath = path.join(process.env.HTML_PATH, rndPath);
      const dstPDFPath = path.join(process.env.PDF_PATH, rndPath);
      fse.ensureDirSync(dstHTMLPath);
      fse.ensureDirSync(dstPDFPath);

      // get warehouse detail
      let drugLists = await pharmacyModel.getOpdDrugbyvn(db, vn)
      json.drugLists = drugLists;
      json.name = drugLists[0].title + drugLists[0].name + ' ' + drugLists[0].surname;

      gulp.task('html', (cb) => {
        let pugFile = path.join(process.env.PUG_PATH, '/opd-drug-list.pug')
        return gulp.src(pugFile)
          .pipe(gulpData(() => {
            return json;
          }))
          .pipe(gulpPug())
          .pipe(gulp.dest(dstHTMLPath));
      });

      // creat pdf
      gulp.task('pdf', ['html'], () => {
        var html = fs.readFileSync(dstHTMLPath + '/opd-drug-list.html', 'utf8')
        var options = {
          format: 'A5',
          orientation: 'landscape',
          footer: {
            height: "15mm",
            contents: '<div class="text-right"><span style="color: #444;"><small>พิมพ์: ' + moment().locale('th').format('ll') + '</small></span></div>'
          }
        };

        let r = new Random();
        let rndFile = r.uuid4(Random.engines.mt19937().seedWithArray([0x12345678, 0x90abcdef]));
        let pdfName = path.join(dstPDFPath, `${rndFile}.pdf`);

        pdf.create(html, options).toFile(pdfName, function (err, resp) {
          if (err) {
            res.send({ ok: false, msg: err });
          } else {
            

            let data = fs.readFileSync(pdfName);
            res.writeHead(200, {
              'Content-Type': 'application/pdf',
              'Content-Length': data.length
            });
            res.end(data);
          // res.download(pdfName, function () {
            rimraf.sync(dstPDFPath);
            rimraf.sync(dstHTMLPath);


            /*res.download(pdfName, function () {
              rimraf.sync(dstPDFPath);
              rimraf.sync(dstHTMLPath);
              fse.removeSync(pdfName);
            });*/
          }
        });
      });
      // Convert html to pdf
      gulp.start('pdf');
    } catch (error) {
      console.log(error);
      res.send({ ok: false, error: error.message });
    } finally {
      db.destroy();
    }
  } else {
      res.send({ ok: false, error: 'vn not found' });
  }  
}));

export default router;

'use strict';

import * as express from 'express';
import * as moment from 'moment';

import { HospdataModel } from '../models/hospdata';
import { LoginModel } from '../models/login';
import { HospdataService } from '../services/hospdata.service';
import { OpdModel } from '../models/opd';
import { IpdModel } from '../models/ipd';

const router = express.Router();
const hospdataModel = new HospdataModel();
const loginModel = new LoginModel();
const hospdataService = new HospdataService();
const opdModel = new OpdModel();
const ipdModel = new IpdModel();
const today = moment().format('YYYY-MM-DD HH:mm:ss');

router.get('/', (req, res, next) => {
    res.send({
        status: 200,
        ok: true,
        module: 'ipd',
    });
});

router.post('/patient', (req, res, next) => {
    let db = req.dbHospData;
    let an = req.body.an;
    let hn = req.body.hn;
    let vn = req.body.vn;
    let admit = req.body.admit;
    let disc = req.body.disc;
    let dep: any = req.body.dep;
    let ward: any = req.body.ward;
    let dr: any = req.body.dr;
    let drDisc: any = req.body.drDisc;
    let drStaff: any = req.body.drStaff;
    let drg: any = req.body.drg;

    let tokenKey = req.body.tokenKey || '';
    if (tokenKey === '' || tokenKey.length < 16) {
        res.send({ status: 400, ok: false, error: 'invalid token' });
    }
    let where = {};
    let order = 'an';

    if (an && an !== '') {
        where['an'] = an.trim();
        order = 'an';
    }
    if (hn && hn !== '') {
        where['hn'] = hn.trim();
        order = 'an';
    }
    if (vn && vn !== '') {
        where['vn'] = vn.trim();
        order = 'an';
    }
    if (admit && moment(admit)) {
        where['admite'] = moment(admit).locale('th').format('YYYY-MM-DD');
        order = 'admite';
    }
    if (disc && moment(disc)) {
        where['disc'] = moment(disc).locale('th').format('YYYY-MM-DD');
        order = 'disc';
    }
    if (dep && dep !== '') {
        where['dep'] = dep.trim();
        order = 'ward';
    }
    if (ward && ward !== '') {
        where['ward'] = ward.trim();
    }
    if (dr && dr !== '') {
        where['dr'] = dr.trim();
        order = 'ward';
    }
    if (drDisc && drDisc !== '') {
        where['dr_disc'] = drDisc.trim();
        order = 'ward';
    }
    if (drStaff && drStaff !== '') {
        where['staff'] = drStaff.trim();
        order = 'ward';
    }

    if (!where) {
        res.send({ status: 400, ok: false, error: 'invalid parameters' });
    }

    const today = moment().format('YYYY-MM-DD HH:mm:ss');
    ipdModel.getIpdVisit(db, where, order)
        .then((results: any) => {
            console.log('ipd visit ', where, ' = ' + results.length + ' record<s> founded.');
            res.send({ status: 200, ok: true, rows: results });
        })
        .catch(error => {
            console.log(error);
            res.send({ status: 400, ok: false, error: error })
        })
        .finally(() => {
            db.destroy();
        });
});

router.post('/patient/:datetype/:start_date/:end_date', (req, res, next) => {
    let db = req.dbHospData;
    let datetype = req.params.datetype;
    let start_date = req.params.start_date;
    let end_date = req.params.end_date;
    let hn = req.body.hn;
    let admit = req.body.admit;
    let disc = req.body.disc;
    let dep: any = req.body.dep;
    let ward: any = req.body.ward;
    let dr: any = req.body.dr;
    let drDisc: any = req.body.drDisc;
    let drStaff: any = req.body.drStaff;
    let drg: any = req.body.drg;

    let tokenKey = req.body.tokenKey || '';
    if (tokenKey === '' || tokenKey.length < 16) {
        res.send({ status: 400, ok: false, error: 'invalid token' });
        return ;
    }
    let where = {};
    let order = 'an';

    datetype = datetype === 'admit' ? 'admite' : 'disc';
    if (hn && hn !== '') {
        where['hn'] = hn.trim();
        order = 'an';
    }
    if (admit && moment(admit)) {
        where['admite'] = moment(admit).locale('th').format('YYYY-MM-DD');
        order = 'admite';
    }
    if (disc && moment(disc)) {
        where['disc'] = moment(disc).locale('th').format('YYYY-MM-DD');
        order = 'disc';
    }
    if (dep && dep !== '') {
        where['dep'] = dep.trim();
        order = 'ward';
    }
    if (ward && ward !== '') {
        where['ward'] = ward.trim();
    }
    if (dr && dr !== '') {
        where['dr'] = dr.trim();
        order = 'ward';
    }
    if (drDisc && drDisc !== '') {
        where['dr_disc'] = drDisc.trim();
        order = 'ward';
    }
    if (drStaff && drStaff !== '') {
        where['staff'] = drStaff.trim();
        order = 'ward';
    }

    if (!where) {
//        res.send({ status: 400, ok: false, error: 'invalid parameters' });
    }

    const today = moment().format('YYYY-MM-DD HH:mm:ss');
    ipdModel.getIpdByDate(db, where, datetype, start_date, end_date, order)
        .then((results: any) => {
            console.log('ipd visit ', where, ' = ' + results.length + ' record<s> founded.');
            res.send({ status: 200, ok: true, rows: results });
        })
        .catch(error => {
            console.log(error);
            res.send({ status: 400, ok: false, error: error })
        })
        .finally(() => {
            db.destroy();
        });
});

router.post('/dx', (req, res, next) => {
    let an: string = req.body.an;

    let tokenKey = req.body.tokenKey || '';
    if (tokenKey === '' || tokenKey.length < 16) {
        res.send({ status: 400, ok: false, error: 'invalid token' });
        return ;
    }

    let db = req.dbHospData;
    ipdModel.getDx(db, an)
        .then((results: any) => {
            if (results && results.length > 0) {
                console.log('ipd dx an: ' + an + ' = ' + results.length + ' record<s> founded.');
                res.send({ status: 200, ok: true, rows: results });
            } else {
                console.log('ipd dx an: ' + an + ' not founded.');
                res.send({ status: 400, ok: true, error: results });
            }
        })
        .catch(error => {
            console.log(error);
            res.send({ status: 500, ok: true, error: error });
        })
        .finally(() => {
            db.destroy();
        });
});

router.post('/op', (req, res, next) => {
    let an: string = req.body.an;

    let tokenKey = req.body.tokenKey || '';
    if (tokenKey === '' || tokenKey.length < 16) {
        res.send({ status: 400, ok: false, error: 'invalid token' });
        return ;
    }

    let db = req.dbHospData;
    ipdModel.getOp(db, an)
        .then((results: any) => {
            if (results && results.length > 0) {
                console.log('ipd op an: ' + an + ' = ' + results.length + ' record<s> founded.');
                res.send({ status: 200, ok: true, rows: results });
            } else {
                console.log('ipd op an: ' + an + ' not founded.');
                res.send({ status: 400, ok: true, error: results });
            }
        })
        .catch(error => {
            console.log(error);
            res.send({ status: 500, ok: true, error: error });
        })
        .finally(() => {
            db.destroy();
        });
});

router.post('/rx', (req, res, next) => {
    let an: string = req.body.an;

    let tokenKey = req.body.tokenKey || '';
    if (tokenKey === '' || tokenKey.length < 16) {
        res.send({ status: 400, ok: false, error: 'invalid token' });
        return ;
    }

    let db = req.dbHospData;
    ipdModel.getRx(db, an)
        .then((results: any) => {
            if (results && results.length > 0) {
                console.log('ipd rx an: ' + an + ' = ' + results.length + ' record<s> founded.');
                res.send({ status: 200, ok: true, rows: results });
            } else {
                console.log('ipd rx an: ' + an + ' not founded.');
                res.send({ status: 400, ok: true, error: results });
            }
        })
        .catch(error => {
            console.log(error);
            res.send({ status: 400, ok: true, error: error });
        })
        .finally(() => {
            db.destroy();
        });
});

router.post('/charge', (req, res, next) => {
    let an: string = req.body.an;
    let typeSum: string = req.body.typeSum || 'list';

    let tokenKey = req.body.tokenKey || '';
    if (tokenKey === '' || tokenKey.length < 16) {
        res.send({ status: 400, ok: false, error: 'invalid token' });
        return ;
    }

    let db = req.dbHospData;
    ipdModel.getCharge(db, an, typeSum)
        .then((results: any) => {
            console.log('ipd charge an: ' + an + ' = ' + results.length + ' record<s> founded.');
            if (results.length > 0) {
                res.send({ status: 200, ok: true, rows: results });
            } else {
                res.send({ status: 400, ok: true, error: results });
            }
        })
        .catch(error => {
            console.log(error);
            res.send({ status: 400, ok: true, error: error });
        })
        .finally(() => {
            db.destroy();
        });
});

router.post('/sum-charge', (req, res, next) => {
    let an: string = req.body.an;

    let tokenKey = req.body.tokenKey || '';
    if (tokenKey === '' || tokenKey.length < 16) {
        res.send({ status: 400, ok: false, error: 'invalid token' });
        return ;
    }

    let db = req.dbHospData;
    ipdModel.sumCharge(db, an)
        .then((results: any) => {
            console.log('ipd sum charge an: ' + an + ' = ' + results.length + ' record<s> founded.');
            if (results.length > 0) {
                res.send({ status: 200, ok: true, rows: results[0] });
            } else {
                res.send({ status: 400, ok: true, error: results });
            }
        })
        .catch(error => {
            console.log(error);
            res.send({ status: 400, ok: true, error: error });
        })
        .finally(() => {
            db.destroy();
        });
});


export default router;
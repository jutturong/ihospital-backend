'use strict';

import * as express from 'express';
import * as moment from 'moment';
import * as HttpStatus from 'http-status-codes';
import { PayrollModel } from '../models/payroll/payroll';

const router = express.Router();
const payrollModel = new PayrollModel();

router.post('/get-employee', async (req, res, next) => {
    let db = req.dbHospData;
    let employeeId: any = req.body.employeeId;
    let employeeNo: any = req.body.employeeNo;

    try {
        const result: any = await payrollModel.getEmployee(db, { id: employeeId, no: employeeNo });
        res.status(HttpStatus.OK).send({
            status: HttpStatus.OK,
            rows: result
        });
    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            message: error.message
        });
    }
});

router.post('/get-employees', async (req, res, next) => {
    let db = req.dbHospData;
    let columnName: any = req.body.searchType;
    let searchText: any = req.body.searchText;
    let limit: any = +req.body.limit || 1000;

    try {
        const result: any = await payrollModel.getEmployees(db, columnName, searchText, limit);
        res.status(HttpStatus.OK).send({
            status: HttpStatus.OK,
            rows: result
        });
    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            message: error.message
        });
    }

});

router.post('/search-employee', async (req, res, next) => {
    let db = req.dbHospData;
    let searchType: any = req.body.searchType;
    let searchValue: any = req.body.searchValue;

    try {
        const result: any = await payrollModel.searchEmployee(db, searchType, searchValue);
        res.status(HttpStatus.OK).send({
            statusCode: HttpStatus.OK,
            rows: result
        });
    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: error.message
        });
    }
});

router.post('/save-employee', async (req, res, next) => {
    let db = req.dbHospData;
    let employeeCode: any = req.body.employeeCode;
    let inputData: any = req.body.inputData;

    try {
        const result = await payrollModel.saveEmployee(db, employeeCode, inputData);
        res.status(HttpStatus.OK).send({
            statusCode: HttpStatus.OK,
            message: result
        });
    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: error.message
        });
    }
});

router.post('/get-bank', (req, res, next) => {
    let db = req.dbHospData;
    let id: any = req.body.id;
    let tokenKey = req.body.tokenKey;
    if (tokenKey === '') {
        res.send({ status: 400, ok: false, error: 'token not found' });
    }

    payrollModel.getBank(db, id)
        .then((results: any) => {
            console.log('get bank ' + id + ' success.');
            res.send({ status: 200, ok: true, rows: results });
        })
        .catch(error => {
            console.log(error);
            res.send({ status: 500, ok: false, error: error });
        })
        .finally(() => {
            db.destroy();
        });
});

router.post('/save-bank', (req, res, next) => {
    let db = req.dbHospData;
    let id: any = req.body.id;
    let inputData: any = req.body.inputData;
    let tokenKey = req.body.tokenKey;
    if (tokenKey === '' || !inputData) {
        res.send({ status: 400, ok: false, error: 'token not found' });
    }

    payrollModel.saveBank(db, id, inputData)
        .then((results: any) => {
            console.log('save bank ' + id + ' success.');
            res.send({ status: 200, ok: true, rows: results });
        })
        .catch(error => {
            console.log(error);
            res.send({ status: 500, ok: false, error: error });
        })
        .finally(() => {
            db.destroy();
        });
});

router.post('/get-bank-branch', (req, res, next) => {
    let db = req.dbHospData;
    let id: any = req.body.id || 0;
    let bank: any = req.body.bank || 0;
    let tokenKey = req.body.tokenKey;
    if (tokenKey === '') {
        res.send({ status: 400, ok: false, error: 'token not found' });
    }

    payrollModel.getBankBranch(db, id, bank)
        .then((results: any) => {
            console.log('get bank branch ' + id + ' success.');
            res.send({ status: 200, ok: true, rows: results });
        })
        .catch(error => {
            console.log(error);
            res.send({ status: 500, ok: false, error: error });
        })
        .finally(() => {
            db.destroy();
        });
});

router.post('/save-bank-branch', (req, res, next) => {
    let db = req.dbHospData;
    let id: any = req.body.id;
    let inputData: any = req.body.inputData;
    let tokenKey = req.body.tokenKey;
    if (tokenKey === '' || !inputData) {
        res.send({ status: 400, ok: false, error: 'token not found' });
    }

    payrollModel.saveBankBranch(db, id, inputData)
        .then((results: any) => {
            console.log('save bank branch ' + id + ' success.');
            res.send({ status: 200, ok: true, rows: results });
        })
        .catch(error => {
            console.log(error);
            res.send({ status: 500, ok: false, error: error });
        })
        .finally(() => {
            db.destroy();
        });
});

router.post('/get-salary', (req, res, next) => {
    let db = req.dbHospData;
    let salaryNo = req.body.salaryNo;
    let month = +req.body.month;
    let year = +req.body.year;
    let tokenKey = req.body.tokenKey;
    if (tokenKey === '') {
        res.send({ status: 400, ok: false, error: 'token not found' });
    }

    payrollModel.getSalary(db, salaryNo, month, year)
        .then((results: any) => {
            console.log('salary ' + salaryNo + ' ' + month + ' ' + year +
                ' = ' + results.length + ' record<s> founded.');
            payrollModel.getSalaryItem(db, salaryNo, month, year)
                .then((items: any) => {
                    res.send({
                        status: 200,
                        ok: true,
                        rows: { data: results, item: items }
                    });
                });
        })
        .catch(error => {
            console.log(error);
            res.send({ status: 400, ok: false, error: error });
        })
        .finally(() => {
            db.destroy();
        });
});

router.post('/salary-monthly', async (req, res, next) => {
    let db = req.dbHospData;
    let month = +req.body.month || (moment().locale('th').get('month') + 1);
    let year = +req.body.year || moment().locale('th').get('year');
    try {
        const result: any = await payrollModel.getSalaryMonthly(db, month, year);
        res.send({
            statusCode: HttpStatus.OK,
            reccount: result.length,
            rows: result
        });
    } catch (error) {
        res.send({
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: error.message
        });
    }
});

router.post('/search-salary-monthly', async (req, res, next) => {
    let db = req.dbHospData;
    let searchType = req.body.searchType || 'no';
    let searchValue = req.body.searchValue || '';
    try {
        const result: any = await payrollModel.searchSalaryMonthly(db, searchType, searchValue);
        res.send({
            statusCode: HttpStatus.OK,
            reccount: result.length,
            rows: result
        });
    } catch (error) {
        res.send({
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: error.message
        });
    }
});

router.post('/salary-monthly-item', async (req, res, next) => {
    let db = req.dbHospData;
    let month = +req.body.month || (moment().locale('th').get('month') + 1);
    let year = +req.body.year || moment().locale('th').get('year');
    let employeeNo = req.body.employeeNo || '';

    if (employeeNo) {
        try {
            const result: any = await payrollModel.getSalaryMonthlyItem(db, employeeNo, month, year);
            res.send({
                statusCode: HttpStatus.OK,
                reccount: result.length,
                rows: result
            });
        } catch (error) {
            res.send({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message
            });
        }
    } else {
        res.send({
            statusCode: HttpStatus.BAD_REQUEST,
            message: HttpStatus.getStatusText(HttpStatus.BAD_REQUEST)
        });
    }
});

router.post('/salary-all-item', async (req, res, next) => {
    let db = req.dbHospData;
    let employeeNo = req.body.employeeNo || '';

    if (employeeNo) {
        try {
            const result: any = await payrollModel.getSalaryMonthlyItemAll(db, employeeNo);
            res.send({
                statusCode: HttpStatus.OK,
                reccount: result.length,
                rows: result
            });
        } catch (error) {
            res.send({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message
            });
        }
    } else {
        res.send({
            statusCode: HttpStatus.BAD_REQUEST,
            message: HttpStatus.getStatusText(HttpStatus.BAD_REQUEST)
        });
    }
});

router.post('/get-tax-yearly', (req, res, next) => {
    let db = req.dbHospData;
    let salaryNo = req.body.salaryNo;
    let year = +req.body.year;
    let tokenKey = req.body.tokenKey;
    if (tokenKey === '') {
        res.send({ status: 400, ok: false, error: 'token not found' });
    }

    if (salaryNo === '' || year < 2545) {
        res.send({ status: 400, ok: false, error: 'Invalid parameters' });
    }

    payrollModel.getTaxYearly(db, salaryNo, year)
        .then((results: any) => {
            console.log('tax yearly ' + salaryNo + ' ' + year +
                ' = ' + results.length + ' record<s> founded.');
            res.send({
                status: 200,
                ok: true,
                rows: results
            });
        })
        .catch(error => {
            console.log(error);
            res.send({ status: 400, ok: false, error: error });
        })
        .finally(() => {
            db.destroy();
        });
});

router.post('/lib-paytype', async (req, res, next) => {
    let db = req.dbHospData;

    try {
        const result: any = await payrollModel.getLibPayType(db);
        res.send({
            statusCode: HttpStatus.OK,
            rows: result
        });
    } catch (error) {
        res.send({
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: error.message
        });
    }
});

router.post('/lib-paytype-group', async (req, res, next) => {
    let db = req.dbHospData;

    try {
        const result: any = await payrollModel.getLibPayTypeGroup(db);
        res.send({
            statusCode: HttpStatus.OK,
            rows: result
        });
    } catch (error) {
        res.send({
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: error.message
        });
    }
});

router.post('/lib-employee-type', async (req, res, next) => {
    let db = req.dbHospData;

    try {
        const result: any = await payrollModel.getLibEmployeeType(db);
        res.send({
            statusCode: HttpStatus.OK,
            rows: result
        });
    } catch (error) {
        res.send({
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: error.message
        });
    }
});

router.post('/save-salary-order', async (req, res, next) => {
    let db = req.dbHospData;
    let ref = req.body.ref || 0;
    let data = req.body.data;

    if (data) {
        try {
            const result: any = await payrollModel.saveSalaryOrder(db, data, ref);
            res.send({
                statusCode: HttpStatus.OK,
                result
            });
        } catch (error) {
            res.send({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message
            });
        }
    } else {
        res.send({
            statusCode: HttpStatus.BAD_REQUEST,
            message: HttpStatus.getStatusText(HttpStatus.BAD_REQUEST)
        });
    }
});

router.post('/delete-salary-order', async (req, res, next) => {
    let db = req.dbHospData;
    let year = req.body.year;
    let period = req.body.period;

    if (year && period) {
        try {
            const result: any = await payrollModel.deleteSalaryOrder(db, year, period);
            res.send({
                statusCode: HttpStatus.OK,
                result
            });
        } catch (error) {
            res.send({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message
            });
        }
    } else {
        res.send({
            statusCode: HttpStatus.BAD_REQUEST,
            message: HttpStatus.getStatusText(HttpStatus.BAD_REQUEST)
        });
    }
});

router.post('/delete-salary-order-by-ref', async (req, res, next) => {
    let db = req.dbHospData;
    let ref = +req.body.ref || 0;

    if (ref > 0) {
        try {
            const result: any = await payrollModel.deleteSalaryOrderByRef(db, ref);
            res.send({
                statusCode: HttpStatus.OK,
                result
            });
        } catch (error) {
            res.send({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message
            });
        }
    } else {
        res.send({
            statusCode: HttpStatus.BAD_REQUEST,
            message: HttpStatus.getStatusText(HttpStatus.BAD_REQUEST)
        });
    }
});


export default router;
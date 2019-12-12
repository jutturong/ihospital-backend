'use strict';

import * as express from 'express';
import * as moment from 'moment';

const router = express.Router();

router.get('/', (req, res, next) => {
    res.send({
        ok: true,
        module: 'hospdata',
        date: moment().format('YYYY-MM-DD HH:mm:ss'),
        token: 'none'
    });
});


export default router;
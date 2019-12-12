# API สำหรับระบบ iHospital
### โรงพยาบาลขอนแก่น
---

<space><space>
### service
* /
* /data
* /opd
* /ipd
* /employee
* /login

<space><space>
### How to
```javascript
git clone -b develop https://gitlab.com/khonkaenhospital/ihospital-backend.git
cd ihospital-backend
npm install
nodemon
```

<space><space>
### opd route
```javascript
[GET] root return status
usage: http://<ip>:3008/hospdata/?

```

<space><space>
### ipd route
```javascript
usage: http://<ip>:3008/ipd/?
[GET] root return status
[POST] patient
		parameter:
			an: any = req.body.an;
			hn: any = req.body.hn;
			admit: date = req.body.admit;
			disc: date = req.body.disc;
			dep: any = req.body.dep;
			ward: any = req.body.ward;
			dr: any = req.body.dr;
			drDisc: any = req.body.drDisc;
			drStaff: any = req.body.drStaff;
			drg: any = req.body.drg;
			tokenKey: string = req.body.tokenKey;

[POST] patient/:datetype/:start_date/:end_date
		parameter:
			datetype = req.params.datetype;  //admit or disc
			start_date = req.params.start_date;
			end_date = req.params.end_date;
			hn: any = req.body.hn;
			admit: date = req.body.admit;
			disc: date = req.body.disc;
			dep: any = req.body.dep;
			ward: any = req.body.ward;
			dr: any = req.body.dr;
			drDisc: any = req.body.drDisc;
			drStaff: any = req.body.drStaff;
			drg: any = req.body.drg;
			tokenKey: string = req.body.tokenKey;

[POST] dx
		parameter:
			an: any = req.body.an;
			tokenKey: string = req.body.tokenKey;

[POST] op    // หัตถการที่เวชระเบียนบันทึก
		parameter:
			an: any = req.body.an;
			tokenKey: string = req.body.tokenKey;

[POST] rx    // กิจกรรมพยาบาล
		parameter:
			an: any = req.body.an;
			tokenKey: string = req.body.tokenKey;

[POST] sum-charge    // ค่ารักษาพยาบาล
		parameter:
			an: any = req.body.an;
			tokenKey: string = req.body.tokenKey;

```

<space><space>
### login route
```javascript
[GET] root return status
usage: http://<ip>:3008/login/
[POST] /
		parameter:
			username: string = req.body.usrname;
			password: string = req.body.password;
			module: string = req.body.module;
			hour: number = req.body.hour;			// expire request, default 12 hour
		return:
			status: 200,
			ok: true,
			data: { prename, fname, lname, employeeNo, userId, userLevel,
						personId,position, positionType, licenseNo (dr), userEmail,
						userTel, defaultOffice, userMobile, UserExpire, tokenKey,
						tokenId, tokenExpire,
						trustee: { module, level, trust, office, default_depart,
										default_unit, default_value, trusted, crud,
										remark }
						},
			token: (JWT)
```


<space><space>
### การตรวจสอบรายละเอียดเครื่อง client
```javascript
usage: http://<ip>:3008/client
[GET] return
{
	status: 200,
	date_response: "1516347913319",
	headers: {
		host: "ae.moph.go.th:3006",
		connection: "keep-alive",
		user-agent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36",
		upgrade-insecure-requests: "1",
		accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
		accept-encoding: "gzip, deflate",
		accept-language: "en-US,en;q=0.9,th;q=0.8,ja;q=0.7",
		cookie: "_ga=GA1.3.2025015617.1489910407",
		if-none-match: "W/"28f-LGkXxtmLEHho2jCKsb3Hhke4A7s"",
	},
	device: "desktop",
	remoteAddress: "192.168.0.1",
	socketremoteAddress: "192.168.0.1.254",
}
```

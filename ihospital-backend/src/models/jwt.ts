import * as jwt from 'jsonwebtoken';

export class Jwt {
  private SecretKey = process.env.SECRET_KEY;
  // private secretKey = '072f789acfee57e2c542da0d5169b4b8';
  private algorithm = 'HS256';

  sign(playload: any, expiresIn = '1d', secretKey = '') {
    secretKey = secretKey === '' ? this.SecretKey : secretKey;
    let token = jwt.sign(playload, secretKey, {
      expiresIn: expiresIn
    });
    return token;
  }

  verify(token: string, secretKey='') {
    secretKey = secretKey === '' ? this.SecretKey : secretKey;
    return new Promise((resolve, reject) => {
      jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
          reject(err)
        } else {
          resolve(decoded)
        }
      });
    });
  }

}
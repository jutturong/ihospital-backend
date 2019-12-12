import Knex = require('knex');
import * as moment from 'moment';
import * as unzip from 'unzip';
import * as fs from 'fs';
import * as fsExtra from 'fs-extra';
import * as parser from 'xml2json';
import * as windows874 from 'windows-874';
import { file } from 'babel-types';
import * as _ from 'lodash';


export class UploadFile {

  public extractPath:string = 'public/uploads/unzip/';
  public tempPath:string = 'public/uploads/temp/';

  constructor(extractPaths?: string, tempPath?: string) {
    this.extractPath = extractPaths;
    this.tempPath = tempPath;
  }

  async extractFile(knex: Knex, file: any) {
    let $this = this;
    var end = new Promise(function(resolve, reject) {
      fs.createReadStream(file.path)
      .pipe(unzip.Extract({
          path: $this.extractPath + file.filename
      }).on('close', function () {
        resolve(true);
      }).on('error', reject));
    });
    return end;
  }

  splitTextToArray(rawText: string) {
    let rows: Array<any>;
    try {
      rows = rawText.split('\n') || [];
    } catch (error) {
      rows = [];
      console.log(error);
    }
    let newArray: Array<any> = [];
    rows.forEach((row, index)=>{
      newArray.push(row.split('|'));
    })
    return newArray;
  }

  async readFileBillTran (id:any) {
    /* select filename*/
    let files:any = await this.readdirAsync(id);
    if(files.length==0) return [];
    let filename:any = await this.selectFile(files,'tran');
    /* read data in file*/
    const stream = this.createStream(id, filename);
    let $this = this;
    var end = new Promise(function(resolve, reject) {
        stream.on('data', (data) => {
            const thaiEncode = windows874.decode(data);
            let json = JSON.parse(parser.toJson(thaiEncode));
            let billtran:Array<any> =  $this.splitTextToArray(json.ClaimRec.BILLTRAN) ;
            let billItems:Array<any> =  $this.splitTextToArray(json.ClaimRec.BillItems)
            json.ClaimRec.BILLTRAN = billtran;
            json.ClaimRec.BillItems = billItems;
            resolve(json);
            stream.destroy();
        });
    });
    return end;
  }

  async readOPServices (id:any) {
    /* select filename*/
    let files:any = await this.readdirAsync(id);
    if(files.length==0) return [];
    let filename:any = await this.selectFile(files,'opservice');
    /* read data in file*/
    const stream = this.createStream(id, filename);
    let $this = this;
    var end = new Promise(function(resolve, reject) {
        stream.on('data', (data) => {
            const thaiEncode = windows874.decode(data);
            let json = JSON.parse(parser.toJson(thaiEncode));
            let opservice:Array<any> =  $this.splitTextToArray(json.ClaimRec.OPServices) 
            let opdx:Array<any> =  $this.splitTextToArray(json.ClaimRec.OPDx)
            json.ClaimRec.OPServices = opservice;
            json.ClaimRec.OPDx = opdx;
            resolve(json);
            stream.destroy();
        });
    });
    return end;
  }

  async readBilldisp (id:any) {
    /* select filename*/
    let files:any = await this.readdirAsync(id);
    if(file.length==0) return [];
    let filename:any = await this.selectFile(files,'disp');
    /* read data in file*/
    const stream = this.createStream(id, filename);
    let $this = this;
    var end = new Promise(function(resolve, reject) {
        stream.on('data', (data) => {
            const thaiEncode = windows874.decode(data);
            let json = JSON.parse(parser.toJson(thaiEncode));
            let master:Array<any> =  $this.splitTextToArray(json.ClaimRec.Dispensing) 
            let items:Array<any> =  $this.splitTextToArray(json.ClaimRec.DispensedItems.$t).filter((value:any, index:number)=>{
              return value.length > 1;
            });
            json.ClaimRec.Dispensing = master;
            json.ClaimRec.DispensedItems = items;
            resolve(json);
            stream.destroy();
        });
    });
    return end;
  }

  createStream(sessionId:string, fileName: string) {
    const stream = fs.createReadStream(this.extractPath+ sessionId + '/'+fileName, {
      encoding: 'latin1',
      highWaterMark : 2024 * 1024
    });
    return stream;
  }

  async readdirAsync(sessionId: string) {
    let path = this.extractPath+ sessionId;
    return new Promise(function (resolve, reject) {
        fs.readdir(path, function (error, result) {
          if (error) {
            resolve([]);
          } else {
            resolve(result);
          }
        });
    });
  }

  selectFile(files: Array<any>, fileName: string){
    return files.find((value, index:number) => {
      let name = value.toLowerCase();
      return name.includes(fileName);
    })
  }
  async deleteFile(file){
    try {
      fs.unlinkSync(this.tempPath+file)
    } catch(err) {
      console.error(err);
    }
  }
  async deleteFolder(file){
    let $this = this;
    return new Promise(function (resolve, reject) {
      console.log($this.extractPath+file);
      fsExtra.remove($this.extractPath+file).then(() => {
        resolve(true);
      }).catch(err => {
        reject(err);
      });
    });
  }
  
}
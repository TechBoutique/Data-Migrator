import path from 'path';
const ejs = require('ejs');    
import { query, Request, Response, response } from "express";
import { readCsv } from '../libs/csvReader';
import { connect } from '../libs/database';   
import multer from 'multer';
let user : any;
let count = 0;   
let error_specify : string;  
let rowcount = new Array();  
let filename : string;
export class DataMigratorService {
  constructor() {}

  public async getUploadCsv(req: any, res: any) {
    try {
      if (!req.file) {
        return res.status(400).json({
          status: false,
          message: 'No file uploaded',
        });
      }   

      const tableName = req.body.table_name;
      const client_id: any = req.body.client_id;  
      const conn = await connect(client_id);  
      filename = req.file.mimetype;  
      if (filename.search("csv") == -1) {  
        res.render('error',{ usermessage: "Parse Error", counts : "Your uploaded file is either corrupt or is not of type CSV" });
      }
      let data = await readCsv(
        path.join(__dirname, `../uploads/${req.file.originalname}`)  
          
      )
        .then((onfulfilled: any) => {
          return onfulfilled;
        })
        .catch((err) => {
          res.status(500).json({
            message: err,
          });
        });
      if (!data) {
        return res.status(500).json({
          message: 'somthing went wrong',
        });
      }

      const columns = data[0];
      let query = `INSERT INTO ${tableName} (`;

      for (let i = 0; i < columns.length; i++) {
        if (i != columns.length - 1) {
          query = query + `${columns[i]},`;
          continue;
        }
        query = query = query + `${columns[i]}) VALUES`;
      }

      let query_status: any = [];
      for (let i = 1; i < data.length; i++) {
        query_status = await conn
          .query(`${query} (?)`, [data[i]])
          .then((onfulfilled: any) => {  
            return ['success', onfulfilled];
          })
          .catch((err) => { 
            user = err;    
            count = i;      
            if(rowcount.indexOf(i,0)==-1){   
              rowcount.push(i);
            }
            return ['failure', err];
          });
      }

      if (query_status[0] === 'success') {  
        res.render('success');
        return res.status(201).json({
          status: query_status[0],
          message: 'Data Migration Successful',
        });
      }

      if (query_status[0] === 'failure') {  
        if(user.errno == 1049){  
          res.render('error',{ usermessage: user.code, counts : "Enter correct database name / client_id" });
        }   
        else if(user.errno ==  1146){ 
          res.render('error',{ usermessage: user.code, counts : "Table by the given name doesn't exist" });
        }   
        else if(user.errno == 1366){    
          res.render('rowerrors',{ usermessage: user.code + " :Your Datatype in CSV file is wrong at follwing row no:", counts : rowcount});
        }     
        else if (user.errno == 1064){  
          res.render('error',{ usermessage: user.code, counts : "Missing Header columns" });
        }  
        else{  
          res.render('error',{ usermessage: user.code, counts : "Unknown error" });
        }    
        return res.status(201).json({  
          status: query_status[0],
          message: 'Data Migration Failed',
          INFO: query_status[1],   
        });
      }
    } catch (err) {     
      res.status(500).json({  
        message: err,     
      });
    }   
    

  }  
  public home(req: Request, res: Response) {   
    res.render('index');
  }
}  


import { Request, Response, response } from "express";
import multer = require('multer');  
const ejs = require('ejs');
const fs = require("fs"); 
const csv = require('fast-csv');
const mysql = require('mysql');
const path = require('path') as any;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'static/uploads/docs'));

  },

  filename: function (req: any, file: any, cb: any) {
    cb(null, file.originalname)
  }
}); 

function fileFilter(req: any, file: any, cb: any) {
  if (file.mimetype === "text/csv") {
  
    cb(null, true);
  } else {
    cb(new Error("Document uploaded is not of type csv"), false);
  }
}   

export const upload = multer({ storage: storage, fileFilter: fileFilter });

export function uploadcsv(req:Request,res:Response){     
  let stream = fs.createReadStream(req.file.path);
  let csvData : any = [];
  let csvStream = csv
      .parse()
      .on("data", function (data : any) {
          csvData.push(data);
      })
      .on("end", function () {
          // Remove Header ROW
          csvData.shift();

          // Create a connection to the database
          const connection = mysql.createConnection({
              host: 'localhost',
              user: 'root',
              password: 'password',
              database: 'db'
          });

          // Open the MySQL connection
          connection.connect((error : any) => {
              if (error) {
                  console.error(error);
              } else {
                  let query = "INSERT INTO sales9 (Transaction_date,Product,Price,Payment_Type,Name,City,State,Country,Account_Created,Last_Login,Latitude,Longitude) VALUES ?";
                  connection.query(query, [csvData], (error : any, response : any) => {
                      console.log(error || response);
                  });
              }
          });
      });

  stream.pipe(csvStream);       
  res.render('index');
}   

export function home(req: Request, res: Response) {   
  res.render('index');
}
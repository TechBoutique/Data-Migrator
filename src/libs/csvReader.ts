import { parse } from 'fast-csv';
import fs from 'fs';

export function readCsv(path: any) {
  return new Promise((resolve, reject) => { 
    let data: any = [];
    fs.createReadStream(path)
      .pipe(parse())
      .on('error', (err) => {
        reject(err);
      })
      .on('data', (csv_data) => {
        data.push(csv_data);
      })
      .on('end', () => {
        resolve(data);
      });
  });
}

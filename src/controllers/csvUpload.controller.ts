import { Request, Response } from 'express';
import { DataMigratorService } from '../services/csvUpload.service';

const dataMigratorService = new DataMigratorService();

export async function getUploadCsv(req: Request, res: Response) {
  return dataMigratorService.getUploadCsv(req, res);
}  

export async function home(req: Request, res: Response) {
  return dataMigratorService.home(req, res);
}

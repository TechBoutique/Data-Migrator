import express, { Application } from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';

// Routes
import csvUploadRoute from './routes/csvUpload.routes';

const fs = require('fs') as any;
const path = require('path') as any;

// create a write stream (in append mode)
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'access.log'),
  { flags: 'a' }
);

export class App {
  private app: Application;

  constructor(private port?: number | string) {
    this.app = express();
    this.settings();
    this.middlewares();
    this.routes();
    console.log('All Server Modules are loaded');
  }

  settings() {
    this.app.set('port', this.port || 3003);  
    this.app.set('view engine', 'ejs');  
  }

  middlewares() {
    this.app.use(morgan('combined', { stream: accessLogStream }));
    this.app.use(morgan('dev'));

    this.app.use(helmet());
    this.app.use(helmet.dnsPrefetchControl({ allow: true }));

    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());

    var corsOptions = {
      origin: '*', // Change to Azure VM IP
      methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
      preflightContinue: true,
      exposedHeaders: [
        'Bearer-Token',
        'Set-Cookie',
        'Content-Type',
        'ETag',
        'Date',
        'Connection',
      ],
    };
    this.app.use(cors(corsOptions));  
    this.app.use('/views', express.static('views'));
    console.log('Initializing Data Migrator Middlewares');
  }

  routes() {
    this.app.use(csvUploadRoute);
    console.log('Initializing CSV Upload Routes');
  }

  async listen() {
    (async () => {
      try {
        this.app.listen(this.app.get('port'), '0.0.0.0');
      } catch (error) {
        console.error(
          'There was a Error with the Server Initialization',
          error
        );
      }
    })();
    console.info(
      `Initializing Data Migrator Microservices Complete. Server is running on port:${this.app.get(
        'port'
      )}`
    );
  }
}

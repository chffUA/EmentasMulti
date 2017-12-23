import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

/*
  Generated class for the Ementas provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Ementas {

  private endpoint = 'http://services.web.ua.pt/sas/ementas?date=week&format=json';

    constructor(public http: Http) {
        console.log('Provider is online');
    }

    //grab current json string
    getCurrent(): Promise<any> {
      let url: string = this.endpoint
      return this.http.get(url)
        .toPromise()
        .then(this.extractData)
        .catch(this.handleError);
    }

    //'Borrowed' from //https://angular.io/docs/ts/latest/guide/server-communication.html
    private extractData(res: Response) {
      //Convert the response to JSON format
      let body = res.json();
      //Return the data (or nothing)
      return body || {};
    }

    //'Borrowed' from //https://angular.io/docs/ts/latest/guide/server-communication.html
    private handleError(res: Response | any) {
      console.error('Entering handleError');
      console.dir(res);
      return Promise.reject(res.message || res);
    }

}

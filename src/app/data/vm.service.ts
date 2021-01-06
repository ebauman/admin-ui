import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { atou } from '../unicode';
import { ServerResponse } from './serverresponse';
import { VM } from './vm';

@Injectable({
  providedIn: 'root'
})
export class VmService {

  constructor(
    public http: HttpClient
  ) { }

  public get(vmid: string) {
    return this.http.get(environment.server + "/vm/" + vmid)
    .pipe(
      map((s: ServerResponse) => {
        return JSON.parse(atou(s.content))
      }
    ))
  }
}

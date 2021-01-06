import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { atou } from '../unicode';
import { ServerResponse } from './serverresponse';
import { VMClaim } from './vmclaim';

@Injectable({
  providedIn: 'root'
})
export class VmclaimService {

  constructor(
    public http: HttpClient
  ) { }

  public get(id: string): Observable<VMClaim> {
    return this.http.get(environment.server + '/vmclaim/' + id)
        .pipe(
            map((s: ServerResponse) => {
                var v = JSON.parse(atou(s.content));
                // The following is necessary because JSON.parse does not nicely
                // handle string -> obj Maps
                var vMap = new Map();
                for (let k of Object.keys(v.vm)) {
                    vMap.set(k.toLowerCase(), v.vm[k]);
                }
                v.vm = vMap;
                return v;
            })
        )
}
}

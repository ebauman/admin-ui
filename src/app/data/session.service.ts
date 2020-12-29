import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, of } from 'rxjs';
import { combineAll, map, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { atou } from '../unicode';
import { ServerResponse } from './serverresponse';
import {Session} from './session';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor(
    public http: HttpClient
  ) { }

  public activecount() {
    return this.http.get(environment.server + "/a/session/activecount")
  }

  public getForUser(id: string) {
    return this.http.get(environment.server + "/a/session/list/" + id)
    .pipe(
      switchMap((s: ServerResponse) => {
        return from(JSON.parse(atou(s.content)))
      }),
      map((s: Session) => {
        s.start_time = new Date(s.start_time);
        s.end_time = new Date(s.end_time);
        s.paused_time = new Date(s.paused_time);
        return of(s);
      }),
      combineAll()
    )
  }
}

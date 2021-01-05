import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { combineAll, map, switchMap, switchMapTo } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { atou } from '../unicode';
import { ServerResponse } from './serverresponse';
import { Session } from './session';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor(
    public http: HttpClient
  ) { }

  public listForUser(userid: string) {
    return this.http.get(environment.server + "/a/session/list/" + userid)
    .pipe(
      switchMap((s: ServerResponse) => JSON.parse(atou(s.content))),
      map((s: Session) => {
        s.end_time = new Date(s.end_time);
        s.start_time = new Date(s.start_time);
        s.paused_time = new Date(s.paused_time);
        if (isNaN(s.paused_time.getDate())) {
          s.paused_time = undefined;
        }
        return of(s);
      }),
      combineAll()
    )
  }

  public finishSession(sessionId: string) {
    return this.http.put(environment.server + "/a/session/" + sessionId + "/finished", {})
  }

  public pauseSession(sessionId: string) {
    return this.http.put(environment.server + "/a/session/" + sessionId + "/pause", {})
  }

  public resumeSession(sessionId: string) {
    return this.http.put(environment.server + "/a/session/" + sessionId + "/resume", {})
  }
}

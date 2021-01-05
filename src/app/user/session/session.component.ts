import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { ServerResponse } from 'src/app/data/serverresponse';
import { Session } from 'src/app/data/session';
import { SessionService } from 'src/app/data/session.service';

@Component({
  selector: 'session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.scss']
})
export class SessionComponent implements OnInit {
  @Input()
  session: Session = new Session();

  public alertType: string = "";
  public alertClosed: boolean = true;
  public alertText: string = "";

  constructor(
    public sessionService: SessionService
  ) { }

  ngOnInit(): void {
  }

  public finishSession() : void {
    this.sessionService.finishSession(this.session.id)
    .subscribe(
      (s: ServerResponse) => {
        this.alertType = "success";
        this.alertText = "Finished session";
        this.alertClosed = false;
        setTimeout(() => {
          this.alertClosed = true;
        }, 2000);
      },
      (s: ServerResponse) => {
        this.alertType = "danger";
        this.alertText = "Error finishing session";
        this.alertClosed = false;
        setTimeout(() => {
          this.alertClosed = true;
        }, 2000);
      }
    )
  }

  public pauseSession(): void {
    this.sessionService.pauseSession(this.session.id)
    .subscribe(
      (s: ServerResponse) => {
        this.alertType = "success";
        this.alertText = "Paused session";
        this.alertClosed = false;
        setTimeout(() => {
          this.alertClosed = true;
        }, 2000)
      },
      (s: ServerResponse) => {
        console.log(s);
        this.alertType = "danger";
        this.alertText = "Error pausing session";
        this.alertClosed = false;
        setTimeout(() => {
          this.alertClosed = true;
        }, 2000)
      }
    )
  }

  public resumeSession(): void {
    this.sessionService.resumeSession(this.session.id)
    .subscribe(
      (s: ServerResponse) => {
        this.alertType = "success";
        this.alertText = "Resumed session";
        this.alertClosed = false;
        setTimeout(() => {
          this.alertClosed = true;
        }, 2000)
      },
      (s: ServerResponse) => {
        this.alertType = "danger";
        this.alertText = "Error resuming session";
        this.alertClosed = false;
        setTimeout(() => {
          this.alertClosed = true;
        }, 2000)
      }
    )
  }
}

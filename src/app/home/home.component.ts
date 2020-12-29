import { Component, OnInit } from '@angular/core';
import { ServerResponse } from '../data/serverresponse';
import { Session } from '../data/session';
import { SessionService } from '../data/session.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public activeSessions: number = 0;

  constructor(
    public sessionService: SessionService
  ) { }

  ngOnInit() {
    this.refresh();
  }

  public refresh() {
    this.sessionService.activecount()
    .subscribe(
      (s: ServerResponse) => this.activeSessions = +s.message
    )
  }

}

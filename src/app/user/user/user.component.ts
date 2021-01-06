import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from 'src/app/data/user.service';
import { User } from 'src/app/data/user';
import { ServerResponse } from 'src/app/data/serverresponse';
import { UserEmailFilter } from 'src/app/user-email-filter';
import { UserIdFilter } from 'src/app/user-id-filter';
import { SessionService } from 'src/app/data/session.service';
import { Session } from 'src/app/data/session';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  public users: User[] = [];

  public selectedUser: User = new User();
  public sessions: Session[] = [];

  public accesscodes: string[] = [];

  constructor(
    public userService: UserService,
    public sessionService: SessionService
  ) { }

  public emailFilter: UserEmailFilter = new UserEmailFilter();
  public idFilter: UserIdFilter = new UserIdFilter();

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.userService.getUsers()
      .subscribe(
        (u: User[]) => {
          this.users = u;
        },
        (s: ServerResponse) => {
          // do something about failure
        }
      )
  }

  public userSelection(u: User) {
    if (u == undefined) {
      return;
    }
    this.selectedUser = u;
    this.sessionService.listForUser(u.id)
    .subscribe(
      (s: Session[]) => {
        this.sessions = s
      }
    )
  }

}

import { Component, Input, OnChanges, OnInit, QueryList, ViewChildren } from '@angular/core';
import { from, of } from 'rxjs';
import { concatMap, map, switchMap, switchMapTo } from 'rxjs/operators';
import { ServerResponse } from 'src/app/data/serverresponse';
import { Session } from 'src/app/data/session';
import { SessionService } from 'src/app/data/session.service';
import { VM } from 'src/app/data/vm';
import { VmService } from 'src/app/data/vm.service';
import { VMClaim } from 'src/app/data/vmclaim';
import { VmclaimService } from 'src/app/data/vmclaim.service';
import { VMClaimVM } from 'src/app/data/VMClaimVM';
import {TerminalModalComponent} from 'src/app/terminal/modal/modal.component';

@Component({
  selector: 'session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.scss']
})
export class SessionComponent implements OnInit, OnChanges {
  @Input()
  session: Session = new Session();

  claims: Map<string, VMClaim> = new Map();
  vms: Map<string, VM> = new Map();

  public alertType: string = "";
  public alertClosed: boolean = true;
  public alertText: string = "";

  constructor(
    public sessionService: SessionService,
    public vmClaimService: VmclaimService,
    public vmService: VmService
  ) { }

  ngOnInit(): void {
    this.claims = new Map();
    this.vms = new Map();
  }

  @ViewChildren("term") terminals: QueryList<TerminalModalComponent>;

  ngOnChanges(): void {
    if(this.session != null) {
      from(this.session.vm_claim)
      .pipe(
        switchMap((claim: string) => this.vmClaimService.get(claim)),
        switchMap((v: VMClaim) => {
          this.claims.set(v.id, v)
          return from(v.vm.values())
        }),
        concatMap((v: VMClaimVM) => {
          return this.vmService.get(v.vm_id)
        })
      ).subscribe(
        (v: VM) => {
          this.vms.set(v.id, v)
          console.log(this.claims);
          console.log(this.vms);
        }
      )
    }
  }

  public successAlert(msg: string) {
    this.alert("success", msg);
  }

  public dangerAlert(msg: string) {
    this.alert("danger", msg);
  }

  public alert(type: string, msg: string) {
    this.alertType = type;
    this.alertText = msg;
    this.alertClosed = false;
    setTimeout(() => this.alertClosed = true, 2000);
  }

  public finishSession() : void {
    this.sessionService.finishSession(this.session.id)
    .subscribe(
      (s: ServerResponse) => {
        this.successAlert("Finished session");
      },
      (s: ServerResponse) => {
        this.dangerAlert("Error finishing session");
      }
    )
  }

  public pauseSession(): void {
    this.sessionService.pauseSession(this.session.id)
    .subscribe(
      (s: ServerResponse) => {
        this.successAlert("Paused session");
      },
      (s: ServerResponse) => {
        this.dangerAlert("Error pausing session");
      }
    )
  }

  public resumeSession(): void {
    this.sessionService.resumeSession(this.session.id)
    .subscribe(
      (s: ServerResponse) => {
        this.successAlert("Resumed session");
      },
      (s: ServerResponse) => {
        this.dangerAlert("Error resuming session");
      }
    )
  }

  public openTerminal(vmid: string) {
    this.terminals.forEach((t: TerminalModalComponent) => {
      if (t.vmid == vmid) {
        t.open();
      }
    })
  }

  public getEndpoint(vmid: string) {
    return this.vms.get(vmid).ws_endpoint;
  }
}

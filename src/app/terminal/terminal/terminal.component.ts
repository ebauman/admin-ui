import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ShellService } from '../../data/shell.service';
import {Terminal} from 'xterm';
import {FitAddon} from 'xterm-addon-fit';
import {AttachAddon} from 'xterm-addon-attach';
import { env } from 'process';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.scss']
})
export class TerminalComponent implements OnInit {
  @Input()
  vmid: string;

  @Input()
  vmname: string;

  @Input()
  endpoint: string;

  terminalWidth: number = 80;

  public screenHeight: number;
  public screenWidth: number;

  public term: Terminal;
  public socket: WebSocket;

  constructor(
    public jwtHelper: JwtHelperService,
    public shellService: ShellService
  ) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
  }

  ngOnInit(): void {
  }

  @ViewChild("terminal", { static: true }) terminalDiv: ElementRef;

  @HostListener("window:resize", ['$event'])
  onResize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
    this.term.resize(this.terminalWidth, Math.floor(this.screenHeight * this.scalingFactor));
  }

  public get scalingFactor() {
    // determine scaling factor. 
    if (this.screenHeight >= 1200) {
      return 0.04;
    } else if (this.screenHeight >= 992) {
      return 0.03;
    } else if (this.screenHeight >= 768) {
      return 0.03;
    } else if (this.screenHeight >= 576) {
      return 0.03;
    } else if (this.screenHeight < 576) {
      return 0.025;
    } else {
      return 0.04;
    }
  }

  public resize() {
    setTimeout(() => this.term.resize(this.terminalWidth, Math.floor(this.screenHeight * this.scalingFactor)), 150);
  }

  buildSocket() {
    this.term = new Terminal();
    const fitAddon = new FitAddon();
    this.term.loadAddon(fitAddon);

    if (!this.endpoint.startsWith("wss://") && !this.endpoint.startsWith("ws://")) {
      if(environment.server.startsWith("https")) {
        this.endpoint = "wss://" + this.endpoint;
      } else {
        this.endpoint = "ws://" + this.endpoint;
      }
    }

    this.socket = new WebSocket(this.endpoint + "/shell/" + this.vmid + "/connect?auth=" + this.jwtHelper.tokenGetter());

    this.socket.onclose = (e) => {
      this.term.dispose();
      this.shellService.setStatus(this.vmname, "Disconnected (" + e.code + ")");
      if (!e.wasClean) {
        this.shellService.setStatus(this.vmname, "Reconnecting " + new Date().toLocaleTimeString());
        setTimeout(() => this.buildSocket(), 2000); // timeout before reconnecting
      }
    }

    this.socket.onopen = (e) => {
      this.shellService.setStatus(this.vmname, "Connected");
      var attach = new AttachAddon(this.socket);

      this.term.loadAddon(attach);
      this.term.open(this.terminalDiv.nativeElement);

      setInterval(() => {
        this.socket.send(''); // keepalive
      }, 5000);
    }
  }

  ngOnChanges() {
    if (this.vmid != null && this.endpoint != null) {
      this.buildSocket();
    }
  }

}

import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ClrModal } from '@clr/angular';

@Component({
  selector: 'terminal-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class TerminalModalComponent implements OnInit {
  @Input()
  vmid: string;

  @Input()
  vmname: string;

  @Input()
  endpoint: string;

  modalOpen: boolean = false;

  constructor() { }

  @ViewChild("modal") modal: ClrModal;

  ngOnInit(): void {
  }

  public open(): void {
    this.modal.open();
  }

}

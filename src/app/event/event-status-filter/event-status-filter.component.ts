import { Component, OnInit, Input } from '@angular/core';
import { ClrDatagridFilter, ClrDatagridFilterInterface } from '@clr/angular';
import { Subject } from 'rxjs';
import { ScheduledEvent } from 'src/app/data/scheduledevent';

@Component({
  selector: 'event-status-filter',
  templateUrl: './event-status-filter.component.html',
  styleUrls: ['./event-status-filter.component.scss']
})
export class EventStatusFilterComponent implements OnInit, ClrDatagridFilterInterface<ScheduledEvent> {
  enabled: boolean = true;

  constructor(private filterContainer: ClrDatagridFilter) {
    filterContainer.setFilter(this);
  }

  changes = new Subject<any>();

  setActive(active: boolean): void {
    this.enabled = active;
    this.changes.next();
  }

  isActive(): boolean {
    return this.enabled;
  }

  accepts(se: ScheduledEvent): boolean {
    return !se.finished;
  }

  ngOnInit(): void {
  }
}
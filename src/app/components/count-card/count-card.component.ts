import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'count-card',
  templateUrl: './count-card.component.html',
  styleUrls: ['./count-card.component.scss']
})
export class CountCardComponent implements OnInit {
  @Input()
  public shape: string;

  @Input()
  public text: string;

  @Input()
  public count: number;

  constructor() { }

  ngOnInit(): void {
  }

}

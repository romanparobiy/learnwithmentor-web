import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PageEvent } from '@angular/material';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit {

  @Input()
  length = 40;
  @Input()
  pageIndex = 0;
  @Input()
  pageSize = 10;
  @Input()
  pageSizeOptions = [5, 10, 20];
  @Output()
  page = new EventEmitter<PageEvent>();

  constructor() {
  }

  ngOnInit() {
  }

  handlePage(event: PageEvent) {
    this.page.emit(event);
  }
}

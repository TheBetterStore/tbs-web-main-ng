import { Component, OnInit } from '@angular/core';
import {IError} from "../../../models/error.interface";
import {ProductService} from "../../../services/product.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ConfirmationService, LazyLoadEvent, MessageService} from "primeng/api";
import {CartService} from "../../../services/cart.service";
import {ErrorService} from "../../../services/admin/error.service";

@Component({
  selector: 'app-errors',
  templateUrl: './errors.component.html',
  styleUrls: ['./errors.component.scss']
})
export class ErrorsComponent implements OnInit {

  isLoading = false;
  errorMsg: string;
  infoMsg: string;

  errors: IError[];
  selectedErrors: IError[];


  maxRowsPerPage = 100;
  pageSize = 5;
  offset = 0;
  rowsPerPageList = [5, 25, 50, 100, this.maxRowsPerPage];

  cols: any[];

  constructor(private errorService: ErrorService, private route: ActivatedRoute,
              private router: Router, private messageService: MessageService,
              private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this.cols = [
      { field: 'ErrorId', header: 'ErrorId', width: '15%', filterMatchMode: 'contains' },
      { field: 'Timestamp', header: 'Timestamp', width: '15%', filterMatchMode: 'contains' },
      { field: 'Status', header: 'Status', width: '8%', filterMatchMode: 'contains' },
      { field: 'Code', header: 'CustomCode', width: '10%', filterMatchMode: 'contains' },
      { field: 'ErrorMessage', header: 'ErrorMessage', width: '20%', filterMatchMode: 'contains' },
      { field: 'Message', header: 'Message', width: '30%', filterMatchMode: 'contains' },
      { width: '8em'}
    ];
    this.loadErrors(null);
  }

  loadErrors(event: LazyLoadEvent): void {
    let sortOrder = 1; // Ascending, -1 = Descending
    let sortField = null;

    if (event) {
      this.pageSize = event.rows ? event.rows : this.pageSize;
      this.offset = event.first ? event.first : this.offset;
      sortOrder = event.sortOrder ? event.sortOrder : sortOrder;
      sortField = event.sortField ? event.sortField : sortField;
    }

    this.isLoading = true;
    this.errors = [];
    this.selectedErrors = [];

    this.errorService.getErrors(this.pageSize, this.offset, sortField, sortOrder, '')
      .subscribe(
        p => {
          this.errors = p;
          this.errorMsg = '';
          this.isLoading = false;
        },
        e => {
          this.messageService.add({
            severity: 'error',
            summary: 'Status retrieval failed',
            detail: e.message,
            life: 5000
          });
          this.errorMsg = e.message;
          this.isLoading = false;
        },
        () => {
        }
      );
  }
}

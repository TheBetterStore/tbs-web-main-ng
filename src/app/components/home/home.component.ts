import { Component, OnInit } from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {ToastModule} from 'primeng/toast';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {IProduct} from '../../models/product.interface';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, ToastModule, ConfirmDialogModule, ProgressSpinnerModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  isLoading = false;
  errorMsg = '';
  infoMsg = '';

  products: IProduct[] = [];
  pageSize = 5;
  offset = 0;

  cols: any[] = [];

  constructor() {
  }

  ngOnInit(): void {
  }

}

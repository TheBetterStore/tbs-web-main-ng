import { Component, OnInit } from '@angular/core';
import {IProduct} from '../../models/product.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  isLoading = false;
  errorMsg: string;
  infoMsg: string;

  products: IProduct[];
  pageSize = 5;
  offset = 0;

  cols: any[];

  constructor() {
  }

  ngOnInit(): void {
  }

}



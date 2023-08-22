import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'
import { Product } from '../common/product';



@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseURL = 'http://localhost:8080/api/products'

  constructor(private httpClient : HttpClient) { }

  getProductList() : Observable<Product[]>{
    return this.httpClient.get<GetResponse>(this.baseURL).pipe(
      map(response => response._embedded.products)
    );
  }
 
}

interface GetResponse{
  _embedded:{
    products : Product[];
  }
  
}
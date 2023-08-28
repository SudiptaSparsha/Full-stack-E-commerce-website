import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';



@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseURL = 'http://localhost:8080/api/products';

  private categoryUrl = 'http://localhost:8080/api/product-category';

  constructor(private httpClient : HttpClient) { }

  getProductList(categoryId : number) : Observable<Product[]>{

    const searchUrl = `${this.baseURL}/search/findByCategoryId?id=${categoryId}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }

  getProductCategories() : Observable<ProductCategory[]> {
    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }
 
}

interface GetResponseProducts{
  _embedded:{
    products : Product[];
  }  
}

interface GetResponseProductCategory{
  _embedded:{
    productCategory : ProductCategory[];
  }  
}

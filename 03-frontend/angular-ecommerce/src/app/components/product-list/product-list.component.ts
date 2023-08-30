import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products : Product[] = [];
  currentCategoryId : number = 1;
  previousCategoryId : number =1;
  searchMode : boolean = false;

  //new properties for pagination
  thePageNumber : number = 1;
  thePageSize : number = 12;
  theTotalElements : number = 0;

  constructor(private productService : ProductService,
              private route : ActivatedRoute){}


  ngOnInit(): void {
    
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  updatePageSize(updatedPageSize : String){

    this.thePageSize = +updatedPageSize;

    this.listProducts();

  }


  listProducts() {

    this.searchMode = this.route.snapshot.paramMap.has('keyWord');

    if(this.searchMode){
      this.handleSearchProducts();
    }else{
      this.handleListProducts();
    }
    
  }


  handleSearchProducts() {
    const theKeyWord : String = this.route.snapshot.paramMap.get('keyWord')!;

    this.productService.searchProducts(theKeyWord).subscribe(
      data => {
        this.products = data;
      }
    )
  }

  handleListProducts(){
    const hasCategoryId : boolean = this.route.snapshot.paramMap.has('id');

    if(hasCategoryId){
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
    }else{
      this.currentCategoryId = 1;
    }

    //check if we have a different category than previous
    //Angular will reuse a component if it is currently being viewed

    //if we have a different category id than previous
    //then set thePageNumber back to 1

    if(this.previousCategoryId != this.currentCategoryId){
      this.thePageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;
    console.log(`currentCategoryId = ${this.currentCategoryId}, thePageNumber = ${this.thePageNumber}`);

    this.productService.getProductListPaginate(this.thePageNumber-1,
                                                this.thePageSize,
                                                this.currentCategoryId).subscribe(
                                                  data => {
                                                    this.products = data._embedded.products;
                                                    this.thePageNumber = data.page.number + 1;
                                                    this.thePageSize = data.page.size;
                                                    this.theTotalElements = data.page.totalElements;
                                                  }
                                                );
  }

}

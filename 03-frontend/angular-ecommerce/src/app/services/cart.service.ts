import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItem : CartItem[] = [];

  totalPrice : Subject<number> = new Subject<number>();
  totalQuantity : Subject<number> = new Subject<number>();

  constructor() { }

  addToCart(theCartItem : CartItem){
    //check if we have already the item in the cart
    let alreadyExistInCart : boolean = false;
    let existingCartItem : CartItem | undefined;

    if(this.cartItem.length > 0){

      //find the item in the cart based on item id
      existingCartItem = this.cartItem.find(tempCartItem => tempCartItem.id === theCartItem.id);

      //check if we found it
      alreadyExistInCart = (existingCartItem != undefined);

    }

    if(alreadyExistInCart){
      existingCartItem!.quantity++;
    }else{
      this.cartItem.push(theCartItem);
    }

    this.computeCartTotals();

  }

  computeCartTotals() {
    let totalPriceValue : number = 0;
    let totalQuantityValue : number = 0;

    for(let currentCartItem of this.cartItem){
      totalPriceValue += currentCartItem.unitPrice * currentCartItem.quantity;
      totalQuantityValue += currentCartItem.quantity;
    }

    //publish total price and total quantity
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    this.logCartValue(totalPriceValue, totalQuantityValue);

  }

  logCartValue(totalPriceValue: number, totalQuantityValue: number) {
    
    console.log(`Contents of Cart :`);
    for(let tempCartItem of this.cartItem){
      console.log(`Name : ${tempCartItem.name}, Unit Price : ${tempCartItem.unitPrice},
                  Quantity : ${tempCartItem.quantity}, Subtotal : ${tempCartItem.quantity * tempCartItem.unitPrice}`);
      console.log(`totalPrice : ${totalPriceValue.toFixed(2)}, totalQuantity : ${totalQuantityValue}`);
      console.log("-----------------");
    }
  }
}

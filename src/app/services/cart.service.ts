import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: any[] = [];
  private cartQuantitySubject = new BehaviorSubject<number>(0);
  cartQuantity$ = this.cartQuantitySubject.asObservable();

  addToCart(product: any) {
    const existingItem = this.cartItems.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += product.quantity || 1;
    } else {
      this.cartItems.push({ ...product, quantity: product.quantity || 1 });
    }

    this.updateCartQuantity();
  }

  updateCartQuantity() {
    const totalQuantity = this.cartItems.reduce((total, item) => total + item.quantity, 0);
    this.cartQuantitySubject.next(totalQuantity);
  }

  getCartItems() {
    return this.cartItems;
  }
    
}

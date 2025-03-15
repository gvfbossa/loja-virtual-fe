import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProdutosService } from '../../services/produtos.service';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { SnackbarService } from '../../services/snackbar.service';
import { SpinnerComponent } from "../spinner/spinner.component";

@Component({
    selector: 'app-product-card',
    standalone: true,
    imports: [
    CommonModule,
    RouterModule,
    SpinnerComponent
],
    templateUrl: './product-card.component.html',
    styleUrl: './product-card.component.css'
})

export class ProductCardComponent implements OnInit {
  products: any[] = [];

  loadProdutos = false

  constructor(private produtosService: ProdutosService, private router: Router, private cartService: CartService, private snackbarService: SnackbarService) {}

  ngOnInit(): void {
    this.loadProdutos = true;
  
    setTimeout(() => {
      this.products = this.produtosService.getProdutos()
      this.loadProdutos = false;
    }, 0);
  }  

  viewProduct(product: any) {
    this.router.navigate(['/produto', product.id]);
  }

  addToCart(product: any) {
    product.quantity = 1
    this.cartService.addToCart(product)
    //alert(product.nome + ' adicionado ao carrinho!')
    this.snackbarService.show(`${product.nome} adicionado ao carrinho!`, 'info')
  }


}

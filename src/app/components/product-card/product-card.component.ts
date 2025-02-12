import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProdutosService } from '../../services/produtos.service';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-product-card',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule
    ],
    templateUrl: './product-card.component.html',
    styleUrl: './product-card.component.css'
})

export class ProductCardComponent implements OnInit {
  products: any[] = [];

  constructor(private produtosService: ProdutosService, private router: Router) {}

  ngOnInit(): void {
      this.products = this.produtosService.getProdutos()
  }

  viewProduct(product: any) {
    this.router.navigate(['/produto', product.id]);
  }

  addToCart(product: any) {
    alert(`${product.nome} foi adicionado ao carrinho!`);
  }


}

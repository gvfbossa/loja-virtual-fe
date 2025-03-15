import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProdutosService } from '../../services/produtos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { SnackbarService } from '../../services/snackbar.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product-category',
  imports: [
    RouterModule,
    CommonModule,
    MatSnackBarModule
  ],
  templateUrl: './product-category.component.html',
  styleUrl: './product-category.component.css'
})
export class ProductCategoryComponent  implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];
  category: string = '';
  subcategory: string | null = null;

  constructor(private produtosService: ProdutosService, private router: Router, private cartService: CartService, private route: ActivatedRoute, private snackbarService: SnackbarService) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.category = params['categoria']; 
      this.subcategory = params['subcategoria'] || null;
      console.log('categoria ', this.category, " sub ", this.subcategory)
      this.loadProducts();
    });
  }

  loadProducts() {
    this.products = this.produtosService.getProdutos();
    console.log('Produtos disponíveis:', this.products);
    console.log('Categoria filtrada:', this.category, 'Subcategoria filtrada:', this.subcategory);
  
    this.filteredProducts = this.products.filter(prod => {
      console.log('Verificando produto:', prod);
      if (this.subcategory) {
        return (
          prod.categoria.toLowerCase() === this.category.toLowerCase() && 
          prod.subcategoria.toLowerCase() === this.subcategory.toLowerCase()
        );
      }
      return prod.categoria.toLowerCase() === this.category.toLowerCase();
    });
  
    console.log('Produtos filtrados:', this.filteredProducts);
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
import { Component, OnInit } from '@angular/core';
import { ProdutosService } from '../../services/produtos.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product',
  imports: [
    FormsModule,
    CommonModule,
  ],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit {
  product: any = {};
  
    constructor(private produtosService: ProdutosService, private cartService: CartService, private route: ActivatedRoute) {}
  
    ngOnInit(): void {
      const id = this.route.snapshot.paramMap.get('id'); // Pegando o ID corretamente da URL
      if (id !== null) {
        console.log('id ' + id)
        const productId = Number(id);
        this.product = this.produtosService.getProdutoById(productId);
        console.log('Produto carregado:', this.product); // Verifique no console
      }
    }    
  
    viewProduct(product: any) {
      
      alert(`Visualizando: ${product.name} ${product.id}`);
    }
  
    addToCart(product: any) {
      if (!product.quantity || product.quantity < 1) {
        alert('Você precisa selecionar pelo menos uma unidade.');
        return;
      }
  
      this.cartService.addToCart(product);
    }

}

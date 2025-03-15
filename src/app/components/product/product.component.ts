import { Component, OnInit } from '@angular/core';
import { ProdutosService } from '../../services/produtos.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { SnackbarService } from '../../services/snackbar.service';
import { SpinnerComponent } from "../spinner/spinner.component";

@Component({
  selector: 'app-product',
  imports: [
    FormsModule,
    CommonModule,
    SpinnerComponent
],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit {
  product: any = {};
  loadProduto = false
  
    constructor(private snackbarService: SnackbarService, private produtosService: ProdutosService, private cartService: CartService, private route: ActivatedRoute) {}
  
    ngOnInit(): void {
      const id = this.route.snapshot.paramMap.get('id')
      this.loadProduto = true
      if (id !== null) {
        console.log('id ' + id)
        const productId = Number(id);
        setTimeout(() => {
          this.product = this.produtosService.getProdutoById(productId);
          this.loadProduto = false;
        }, 0);
        console.log('Produto carregado:', this.product); // Verifique no console
      }
    }    
  
    viewProduct(product: any) {
      
      alert(`Visualizando: ${product.name} ${product.id}`);
    }
  
    addToCart(product: any) {
      if (!product.quantity || product.quantity < 1) {
        //alert('Você precisa selecionar pelo menos uma unidade.');
        this.snackbarService.show('Você precisa selecionar pelo menos uma unidade', 'error')
        return;
      }
    
      this.cartService.addToCart(product);
      this.snackbarService.show(`${product.quantity} unidade(s) de ${product.nome} adicionada(s) ao carrinho`, 'info')
      product.quantity = 1;
      console.log('Produto adicionado ao carrinho:', product);
    }    

}

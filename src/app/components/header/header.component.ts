import { Component, OnInit } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'
import { Router } from '@angular/router'
import { MatIconModule } from '@angular/material/icon';
import { CartService } from '../../services/cart.service';
import { ProdutosService } from '../../services/produtos.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatIconModule,
    RouterModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  cartQuantity: number = 0;

  constructor(private router: Router, private cartService: CartService, private produtosService: ProdutosService) {}

  isMenuOpen = false

  currentDateTime: string = ''

  searchQuery: string = ''
  filteredProdutos: any[] = []
  produtos: any[] = []

  categories: { 
    name: string; 
    route: string; 
    subcategories?: { name: string; route: string }[] 
  }[] = [
    { 
      name: 'SITES', 
      route: 'site', 
      subcategories: [
        { name: 'Pessoal', route: 'categoria/site/pessoal' },
        { name: 'Empresarial', route: 'categoria/site/empresa' },
        { name: 'Landing Page', route: 'categoria/site/landing-page' },
      ]
    },
    {
      name: 'SISTEMAS', 
      route: 'categoria/sistema'
    },
    { name: 'APPS', 
      route: 'categoria/app',
      subcategories: [
        { name: 'Pizzaria', route: 'categoria/app/pizzaria' },
        { name: 'Entregas', route: 'categoria/app/entregas' },
        { name: 'Conectividade', route: 'categoria/app/conectividade' }
      ]
    },
    
  ]
  
  ngOnInit(): void {
    this.cartService.cartQuantity$.subscribe(quantity => {
      this.cartQuantity = quantity; 
    });
    this.produtos = this.produtosService.getProdutos()
  }

  navigateToCart() {
    this.router.navigate(['/cart'], { state: { cartItems: this.cartService.getCartItems() } });
  }

  navigateTo(route: string) {
    if (route)
      this.router.navigate([route])
    else 
      this.router.navigate([''])
  }

  navigateToProduto(id: any) {
    this.router.navigate(['produto/', id]);
    this.filteredProdutos = []
    this.searchQuery = ''
  }

  filterProdutos() {
    const searchTerm = this.searchQuery.trim().toLowerCase()
    if (searchTerm.length > 2) {
      this.filteredProdutos = this.produtos.filter((produto) =>
        produto.nome.toLowerCase().includes(searchTerm)
      )
    } else {
      this.filteredProdutos = []
    }
  }

  focusOnSearch() {
    document.getElementById('search-box')?.focus()
  }

}

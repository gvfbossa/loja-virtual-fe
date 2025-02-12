import { Component, OnInit } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'
import { Router } from '@angular/router'
import { MatIconModule } from '@angular/material/icon';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatIconModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  cartQuantity: number = 0;

  constructor(private router: Router, private cartService: CartService) {}

  isMenuOpen = false

  currentDateTime: string = ''

  searchQuery: string = ''
  filteredNoticias: any[] = []
  noticias: any[] = []

  categories: { 
    name: string; 
    route: string; 
    subcategories?: { name: string; route: string }[] 
  }[] = [
    { 
      name: 'COCADAS DE CORTE', 
      route: 'corte', 
      subcategories: [
        { name: 'Tradicional', route: 'noticia-categoria/geral' },
        { name: 'Prestígio', route: 'noticia-categoria/politica' },
        { name: 'Doce de Leite', route: 'noticia-categoria/politica' },
      ]
    },
    {
      name: 'COCADAS CREMOSAS',
      route: 'cremosa'
    },
    { name: 'COCADAS DE FORNO', 
      route: 'noticia-categoria/agenda',
      subcategories: [
        { name: '100g', route: '' },
        { name: '500g', route: '' },
        { name: '1000g', route: '' }
      ]
    },
    
  ]
  
  ngOnInit(): void {
    this.cartService.cartQuantity$.subscribe(quantity => {
      this.cartQuantity = quantity; 
    });
  }

  navigateToCart() {
    console.log('cartItems ', this.cartService.getCartItems())
    this.router.navigate(['/cart'], { state: { cartItems: this.cartService.getCartItems() } });
  }

  navigateTo(p: any, y: any) {
    this.router.navigate(['']);
  }

  filterNoticias() {
    const searchTerm = this.searchQuery.trim().toLowerCase()
    if (searchTerm.length > 2) {
      this.filteredNoticias = this.noticias.filter((noticia) =>
        noticia.headline.toLowerCase().includes(searchTerm)
      )
    } else {
      this.filteredNoticias = []
    }
  }

  focusOnSearch() {
    document.getElementById('search-box')?.focus()
  }    

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen
  }

  updateDateTime() {
    const now = new Date()
    this.currentDateTime = this.capitalizeWords(
      now.toLocaleString('pt-BR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    )
  }
  
  capitalizeWords(input: string): string {
    return input
      .split(' ')
      .map(word => word != 'de' ? word.charAt(0).toUpperCase() + word.slice(1) : word.charAt(0) + word.slice(1))
      .join(' ')
  }

}

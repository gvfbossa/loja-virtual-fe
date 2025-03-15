import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CarouselComponent } from '../carousel/carousel.component';
import { ProductCardComponent } from '../product-card/product-card.component';
import { CommonModule } from '@angular/common';
import { HeroComponent } from "../hero/hero.component";

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [
    FormsModule,
    RouterModule,
    CarouselComponent,
    ProductCardComponent,
    CommonModule,
    HeroComponent
],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
})
export class HomeComponent {
  publicKey: string = 'TEST-b3e69e00-3597-46bd-b289-b4e97ebfe59c';
  quantity: number = 1;
  product: any;

  constructor(private router: Router) {}

  onSubmit() {

    const description = (document.getElementById('description') as HTMLElement).innerText;
    const author = (document.getElementById('author') as HTMLElement).innerText;
    const pages = parseInt((document.getElementById('pages') as HTMLElement).innerText, 10);
    const price = parseFloat((document.getElementById('price-value') as HTMLElement).innerText);
  
    const productDetails = {
      description,
      author,
      pages,
      price,
      quantity: this.quantity
    };
  
    this.router.navigate(['/cart'], { state: { product: productDetails } });
  }
  

}

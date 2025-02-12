import { Component, OnInit } from '@angular/core';
import { ProdutosService } from '../../services/produtos.service';
import { Router } from '@angular/router';
import { ThumbnailDestaqueComponent } from "../thumbnail-destaque/thumbnail-destaque.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-carousel',
  standalone: true,
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css',
  imports: [ThumbnailDestaqueComponent, CommonModule]
})
export class CarouselComponent implements OnInit {
  currentSlide = 0;
  interval: any;
  produtos: any[] = [];

  constructor(
    private produtosService: ProdutosService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.produtos = this.produtosService.getProdutos();
    this.startAutoSlide();
    console.log(this.produtos); // Verifica se está vindo algum dado
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.produtos.length;
    this.updateCarousel();
  }

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.produtos.length) % this.produtos.length;
    this.updateCarousel();
  }

  updateCarousel() {
    const container = document.querySelector('.carousel__container') as HTMLElement;
    if (container) {
      const itemWidth = container.children[0]?.getBoundingClientRect().width || 0;
      const offset = -(this.currentSlide * itemWidth);
      container.style.transform = `translateX(${offset}px)`;
    }
  }

  startAutoSlide() {
    this.interval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  goToProduto(id: number) {
    const produto = this.produtos.find(p => p.id === id);
    if (produto) {
      this.router.navigate(['/produto', id], { state: { produto } });
    }
  }
}

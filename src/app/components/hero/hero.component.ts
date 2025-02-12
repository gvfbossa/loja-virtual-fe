import { Component } from '@angular/core';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css'
})
export class HeroComponent {

  exploreProdutos() {
    window.scrollBy({ top: 596, behavior: 'smooth' }); // 3rem = 48px
  }

}

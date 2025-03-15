import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-compra-pendente',
  imports: [],
  templateUrl: './compra-pendente.component.html',
  styleUrl: './compra-pendente.component.css'
})
export class CompraPendenteComponent implements OnInit {
  constructor(private router: Router) {}
    
    goToCart() {
      this.router.navigate(['/cart']);
    }

    ngOnInit(): void {
      const compraPendente = localStorage.getItem('compraPendente');
      
      if (!compraPendente) {
        this.router.navigate(['/'])
      } else {
        localStorage.removeItem('compraPendente')
      }
    }

}

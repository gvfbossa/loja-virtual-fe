import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-compra-finalizada',
  imports: [],
  templateUrl: './compra-finalizada.component.html',
  styleUrl: './compra-finalizada.component.css'
})
export class CompraFinalizadaComponent implements OnInit {
  constructor(private router: Router) {}
    
    goToHome() {
      this.router.navigate(['/']);
    }

    ngOnInit(): void {
      const compraFinalizada = localStorage.getItem('compraFinalizada');
      
      if (!compraFinalizada) {
        this.router.navigate(['/'])
      } else {
        localStorage.removeItem('compraFinalizada')
      }
    }

}

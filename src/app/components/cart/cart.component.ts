import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CartService } from '../../services/cart.service';
import { FreteService } from '../../services/frete.service';
import { CheckoutService } from '../../services/checkout.service';
import { SnackbarService } from '../../services/snackbar.service';
import { SpinnerComponent } from "../spinner/spinner.component";

@Component({
    selector: 'app-cart',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule, SpinnerComponent],
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.css']
})

export class CartComponent implements OnInit {
  isLoadingFrete = false

  cartItems: any[] = [];

  totalPrice: number = 0
  freteSelecionado: number = 0
  fretes: any[] = []
  cepDestino: string = ''
  product: any;

  selectedPaymentMethod: string = '';

  paymentMethods = [
    { id: 'credito', name: 'Crédito' },
    { id: 'debito', name: 'Débito' },
    { id: 'boleto', name: 'Boleto' },
    { id: 'pix', name: 'Pix' },
  ];

  constructor(private router: Router, private http: HttpClient, private snackbarService: SnackbarService, private cartService: CartService, private freteService: FreteService, private checkoutService: CheckoutService) {}

  async ngOnInit() {
      const navigation = this.router.getCurrentNavigation();
      this.cartItems = navigation?.extras?.state?.['cartItems'] || this.cartService.getCartItems()
    this.setTotalPrice()
  }

  calcularFrete() {
    if (!this.cepDestino) {
      //alert('Por favor, informe o CEP de origem.');
      this.snackbarService.show('Por favor, informe o CEP de origem', 'error')
      return;
    }

    this.isLoadingFrete = true;

    this.freteService.calcularFrete('08730805', this.cepDestino, this.cartItems)
    .subscribe(
      (response) => {
        this.fretes = response.filter((frete: { company: { name: string; }; price: any; }) => 
          frete.company.name === 'Correios' && frete.price
        ).map((frete: { name: any; price: any; company: { name: any; picture: any; }; }) => ({
          name: frete.name,
          price: frete.price,
          companyName: frete.company.name,
          companyPicture: frete.company.picture
        }));
        this.isLoadingFrete = false; 
      },
      (error) => {
        this.isLoadingFrete = false; 
        this.snackbarService.show('Erro ao calcular frete. Por favor tente novamente', 'error')
        //console.log('Erro ao calcular frete: ', error)
      }
    )
  }

  updateQuantity(event: any, index: number) {
    const value = Number(event.target.value);
    this.cartItems[index].quantity = value;
    this.setTotalPrice()
  }

  updateValorFrete(preco: number) {
    this.freteSelecionado = preco
    this.setTotalPrice()
  }

  setTotalPrice() {    
    // Verifica se o valor de freteSelecionado é um número válido
    const frete = parseFloat(this.freteSelecionado.toString()) || 0;
    let total = frete;
  
    this.cartItems.forEach(item => {
      total += parseFloat(item.preco.toString()) * parseInt(item.quantity.toString(), 10);
    });
  
    // Garantir que o total seja um número válido com até duas casas decimais
    this.totalPrice = Math.round(total * 100) / 100;  // Arredonda para 2 casas decimais
  }

  finalizarCompra() {
    if (this.freteSelecionado == 0) {
      //alert('Favor selecionar o método de entrega');
      this.snackbarService.show('Favor selecionar o método de entrega', 'error')
    } 
    else if (this.selectedPaymentMethod == '') {
      this.snackbarService.show('Favor selecionar a forma de pagamento', 'error')
    } else {
      this.checkoutService.setCartState(this.totalPrice, this.cepDestino, this.selectedPaymentMethod)
      this.router.navigate(['checkout']);
    }
  }

}

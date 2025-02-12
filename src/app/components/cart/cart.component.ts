import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { loadMercadoPago } from '@mercadopago/sdk-js';
import { AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { CartService } from '../../services/cart.service';

@Component({
    selector: 'app-cart',
    imports: [CommonModule, FormsModule],
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.css']
})

export class CartComponent implements AfterViewInit {
  publicKey: string = 'TEST-b3e69e00-3597-46bd-b289-b4e97ebfe59c';
  mercadopago: any;
  product: any;
  issuerId: any
  paymentMethodId: any

  cartItems: any[] = [];

  constructor(private router: Router, private http: HttpClient, private cartService: CartService) {}

  async ngOnInit() {
    try {
      await loadMercadoPago();
      this.mercadopago = new window.MercadoPago(this.publicKey);

      const apiKey = await this.getApiKey();
      if (apiKey)
        localStorage.setItem('apiKey', apiKey)
  
      const navigation = this.router.getCurrentNavigation();
      this.cartItems = navigation?.extras?.state?.['cartItems'] || this.cartService.getCartItems();
      console.log('cartItems CARRINHO ', this.cartItems)
    } catch (error) {
      console.error('Erro ao inicializar o Mercado Pago:', error);
    }
    
  }

  async getApiKey() {
    try {
      const response = await firstValueFrom(this.http.get<{ apiKey: string }>('https://localhost:8443/api/auth/generate-api-key'));

      if (response)
        return response.apiKey;
      else
        return null
    } catch (error) {
      console.error('Erro ao obter a chave API:', error);
      return null;
    }
  }

  async ngAfterViewInit() {
    try {
      if (!this.mercadopago) {
        await this.waitForMercadoPago();
      }
  
      const cardNumberElement = this.mercadopago.fields.create('cardNumber', {
        placeholder: "Número do cartão",
      });
      cardNumberElement.mount('cardNumber');
  
      const expirationDateElement = this.mercadopago.fields.create('expirationDate', {
        placeholder: "MM/YY",
      });
      expirationDateElement.mount('expirationDate');
  
      const securityCodeElement = this.mercadopago.fields.create('securityCode', {
        placeholder: "Código de segurança",
      });
      securityCodeElement.mount('securityCode');
  
      cardNumberElement.on('binChange', async (event: any) => {
        const data = { bin: event.bin };
        const paymentMethods = await this.getPaymentMethods(data);
  
        if (paymentMethods.length > 0) {
          const paymentMethodId = paymentMethods[0].id;
          this.paymentMethodId = paymentMethodId
          const issuers = await this.getIssuers(paymentMethodId, event.bin);

          if (issuers.length > 0) {
            this.populateIssuerSelect(issuers);
            await this.getInstallments(paymentMethodId, event.bin);
          }
        }
      });
  
      (async () => {
        try {
          const identificationTypes = await this.mercadopago.getIdentificationTypes();
          const identificationTypeElement = document.getElementById('docType') as HTMLSelectElement;
          this.createSelectOptions(identificationTypeElement, identificationTypes);
        } catch (e) {
          console.error('Error getting identificationTypes: ', e);
        }
      })();
    } catch (error) {
      console.error('Erro ao inicializar os campos do Mercado Pago:', error);
    }
  }

  async getInstallments(paymentMethodId: string, bin: string) {
    const amount = document.getElementById('product-price') as HTMLInputElement;

    try {
      const installments = await this.mercadopago.getInstallments({
        amount: amount.value,
        bin: bin,
        paymentTypeId: 'credit_card'
      });
      
      this.populateInstallmentsSelect(installments);
    } catch (error) {
      console.error('Error getting installments: ', error);
    }
  }

  populateInstallmentsSelect(installments: any) {
    const installmentsSelect = document.getElementById('installmentsSelect') as HTMLSelectElement;
    installmentsSelect.innerHTML = '';
    
    installments[0].payer_costs.forEach((cost: any) => {
      const option = document.createElement('option');
      option.value = cost.installments;
      option.textContent = `${cost.installments} parcela(s) - R$ ${cost.min_allowed_amount.toFixed(2)} até R$ ${cost.max_allowed_amount.toFixed(2)}`;
      installmentsSelect.appendChild(option);
    });
  }

  async getIssuers(paymentMethodId: any, bin: any) {
    const issuers = await this.mercadopago.getIssuers({paymentMethodId, bin });
    return issuers
};
  
  private populateIssuerSelect(issuers: any[]) {
    const issuerSelect = document.getElementById('issuerSelect') as HTMLSelectElement;
    issuerSelect.innerHTML = '';
  
    issuers.forEach(issuer => {
      const option = document.createElement('option');
      option.value = issuer.id;
      this.issuerId = option.value
      option.textContent = issuer.name;
      issuerSelect.appendChild(option);
    });
  }

  private async getPaymentMethods(data: { bin: string }) {
    const { bin } = data;
    try {
      const { results } = await this.mercadopago.getPaymentMethods({ bin });
  
      const paymentMethodElement = document.getElementById('paymentMethodSelect') as HTMLSelectElement;
  
      this.createSelectOptions(paymentMethodElement, results, { label: "name", value: "id" });

      return results
    } catch (error) {
      console.error('Erro ao obter métodos de pagamento:', error);
    }
  }
  

  private createSelectOptions(elem: HTMLSelectElement | null, options: any[], labelsAndKeys = { label: "name", value: "id" }) {
    const { label, value } = labelsAndKeys;
  
    if (elem) {
      elem.options.length = 0;
  
      const tempOptions = document.createDocumentFragment();
  
      options.forEach(option => {
        const optValue = option[value];
        const optLabel = option[label];
  
        const opt = document.createElement('option');
        opt.value = optValue;
        opt.textContent = optLabel;
  
        tempOptions.appendChild(opt);
      });
  
      elem.appendChild(tempOptions);
    }
  }  
  
  private waitForMercadoPago(): Promise<void> {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (this.mercadopago) {
          clearInterval(interval);
          resolve();
        }
      }, 100);
    });
  }

  async generateCardToken() {
    const cardholderName = (document.getElementById('cardholderName') as HTMLInputElement).value;
    const identificationType = (document.getElementById('docType') as HTMLSelectElement).value;
    const identificationNumber = (document.getElementById('identificationNumber') as HTMLInputElement).value;
    let token = null
  
    try {
      token = await this.mercadopago.fields.createCardToken({
        cardholderName,
        identificationType,
        identificationNumber,
      });

      return token
    } catch (error) {
      return null
    }
  }

  async submitForm(event: Event) {
    event.preventDefault(); 

    const token = await this.generateCardToken();

    this.product = this.cartItems[0]

    const transactionAmount = this.product.price * this.product.quantity;
    const installments = (document.getElementById('installmentsSelect') as HTMLSelectElement).value;
    const email = (document.getElementById('cardholderEmail') as HTMLInputElement).value;
    const identificationType = (document.getElementById('docType') as HTMLSelectElement).value;
    const identificationNumber = (document.getElementById('identificationNumber') as HTMLInputElement).value;

    const paymentData = {
        token: token.id,
        transactionAmount,
        installments,
        issuerId: this.issuerId,
        paymentMethodId: this.paymentMethodId,
        productDescription: this.product.description,
        payer: {
            email,
            identification: {
                type: identificationType,
                number: identificationNumber,
            },
        },
    };

    const apiKey = localStorage.getItem('apiKey');

    if (!apiKey) {
      console.error('API key is missing');
      return;
    }

    const headers = {
      'x-api-key': apiKey,
      'Content-Type': 'application/json',
    };

    try {
      this.http.post('https://localhost:8443/api/pagamento', paymentData, { headers }).subscribe({
        next: response => {
            alert('Pagamento realizado com sucesso!');
        },
        error: error => {
          alert('Erro ao processar pagamento, por favor, tente novamente...')
            console.error('Erro ao processar pagamento:', error);
        }
    });
    } catch (error) {
      alert('Erro crítico ao processar pagamento...')
        console.error('Exceção ao processar pagamento:', error);
    }
  }


}

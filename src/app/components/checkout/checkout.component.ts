import { AfterViewInit, Component, OnInit } from '@angular/core';
import { filter, firstValueFrom } from 'rxjs';
import { loadMercadoPago } from '@mercadopago/sdk-js';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CheckoutService } from '../../services/checkout.service';
import { CartService } from '../../services/cart.service';
import { SnackbarService } from '../../services/snackbar.service';
import { SpinnerComponent } from "../spinner/spinner.component";
import { QRCodeComponent } from 'angularx-qrcode';

@Component({
  selector: 'app-checkout',
  imports: [CommonModule, QRCodeComponent, FormsModule, SpinnerComponent, RouterModule],
  standalone: true,
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit, AfterViewInit {
  mock = true 
  isLoadingPagto = false

  totalPrice: number = 0;
  cepDestino: string = '';
  cartItems: any[] = [];

  publicKey: string = 'TEST-b3e69e00-3597-46bd-b289-b4e97ebfe59c';
  mercadopago: any;
  
  issuerId: any
  paymentMethodId: any

  endereco: any
  loadInfo = false

  selectedPaymentMethod = ''

  qrCodePix: string = '';
  copiaECola: string = '';
  pixPaymentId: string | null = null

  boletoGerado: boolean = false;
  linkBoleto: string = '';

  constructor(private router: Router, private http: HttpClient, private snackbarService: SnackbarService, private checkoutService: CheckoutService, private cartService: CartService) {}

  async ngOnInit(): Promise<void> {
    this.loadInfo = true
    setTimeout(async () => {
      this.selectedPaymentMethod = this.checkoutService.getSelectedPaymentMethod()
      this.cartItems = this.cartService.getCartItems()
      this.cepDestino = this.checkoutService.getCepDestino()
      
      if (this.cepDestino) {
        try {
          this.endereco = await this.checkoutService.buscarEnderecoPorCep(this.cepDestino);
        } catch (error) {
        }
      }

      this.totalPrice = this.checkoutService.getTotalPrice()
      this.loadInfo = false
    }, 0);
    

    try {
      await loadMercadoPago();
      this.mercadopago = new window.MercadoPago(this.publicKey);

      const apiKey = await this.getApiKey();
      if (apiKey)
        localStorage.setItem('apiKey', apiKey)

    } catch (error) {
      console.error('Erro ao inicializar o Mercado Pago:', error);
    }
  }

  private generateFakeBoleto(): string {
    let boleto = '';
    for (let i = 0; i < 47; i++) {
      boleto += Math.floor(Math.random() * 10); // Gera números de 0 a 9
    }
    return boleto;
  }

  gerarBoleto(): void {
    this.isLoadingPagto = true;

    if (this.mock) {
      this.isLoadingPagto = true;
      this.linkBoleto = this.generateFakeBoleto()
      this.boletoGerado = true
      setTimeout(() => {
        this.isLoadingPagto = false;
      }, 3000);
      return;
    }

    const identificationNumber = (document.getElementById('identificationNumber') as HTMLInputElement).value;
    const email = (document.getElementById('cardholderEmail') as HTMLInputElement).value;
    const nomeCompleto = (document.getElementById('nomeCompletoBoleto') as HTMLInputElement).value;
    
    const numero = (document.getElementById('numeroEndereco') as HTMLInputElement).value.trim();
    const complemento = (document.getElementById('complementoEndereco') as HTMLInputElement).value.trim();
    const enderecoCompleto = `${this.endereco}${numero ? ' ' + numero : ''}${complemento ? ' ' + complemento : ''}`;

    if (!identificationNumber.trim() || !email.trim() || !nomeCompleto.trim() || !enderecoCompleto.trim()) {
      this.snackbarService.show('Por favor, preencha todos os dados para gerar o Boleto', 'error');
      this.isLoadingPagto = false;
      return;
    }

    const enderecoArray = this.endereco.split(',').map((e: string) => e.trim()); // Remove espaços extras

    if (enderecoArray.length < 3) {
        this.snackbarService.show('Endereço inválido. Verifique o formato.', 'error');
        this.isLoadingPagto = false;
        return;
    }

    const rua = enderecoArray[0]; // Rua
    const bairro = enderecoArray[1]; // Bairro

    // 🔹 Extraindo cidade e UF
    const cidadeUfArray = enderecoArray[2].split('-').map((e: string) => e.trim());

    if (cidadeUfArray.length < 2) {
        this.snackbarService.show('Endereço inválido. Cidade e UF não encontrados.', 'error');
        this.isLoadingPagto = false;
        return;
    }

    const cidade = cidadeUfArray[0]; // Cidade
    const uf = cidadeUfArray[1]; // Estado (UF)

    const nomes = nomeCompleto.trim().split(/\s+/);

    const firstName = nomes.length > 0 ? nomes[0] : "Nome";
    const lastName = nomes.length > 1 ? nomes.slice(1).join(' ') : "Sobrenome";
    
    const boletoPaymentDTO = {
      valor: this.totalPrice,
      firstName: firstName,
      lastName: lastName,
      cpf: identificationNumber,
      email: email,
      cep: this.cepDestino,
      rua: rua,
      numero: numero,
      complemento: complemento,
      bairro: bairro,
      cidade: cidade,
      estado: uf,
    };

    // Enviar a requisição POST para o endpoint do back-end
    this.http.post('https://localhost:8443/api/pagamento/boleto', boletoPaymentDTO)
      .subscribe({
        next: (response: any) => {
          console.log('Response ', response)
          this.boletoGerado = true;
          this.linkBoleto = response.boleto_url;
          this.isLoadingPagto = false;
        },
        error: (err) => {
          console.error('Erro ao gerar boleto', err);
          this.snackbarService.show('Falha ao gerar boleto. Tente novamente.', 'error');
          this.isLoadingPagto = false;
        }        
      });
  }

  private generateFakeBoletoLink(linhaDigitavel: string): string {
    const boletoHTML = `
      <html>
        <head>
          <title>Boleto Simulado</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; margin-top: 50px; }
            h2 { color: #333; }
            .barcode { font-size: 24px; font-weight: bold; letter-spacing: 3px; }
          </style>
        </head>
        <body>
          <h2>Boleto Simulado</h2>
          <p>Apresente esse codigo para pagamento:</p>
          <div class="barcode">${linhaDigitavel}</div>
        </body>
      </html>
    `;
  
    const blob = new Blob([boletoHTML], { type: 'text/html' });
    return URL.createObjectURL(blob);
  }

  baixarBoleto(): void {
    if (this.mock) {
      this.linkBoleto = this.generateFakeBoletoLink(this.generateFakeBoleto());
    window.open(this.linkBoleto, '_blank');

      setTimeout(() => {
        localStorage.setItem('compraPendente', 'true');
        this.router.navigate(['compra-pendente']);
        this.cartService.cleanCart();
      }, 500);
    }

    if (this.linkBoleto) {
        window.open(this.linkBoleto, '_blank');
        
        setTimeout(() => {
            localStorage.setItem('compraFinalizada', 'true');
            this.router.navigate(['compra-finalizada']);
            this.cartService.cleanCart();
        }, 500);
    } else {
        this.snackbarService.show('Boleto não encontrado', 'error');
    }
  }

  checkPixPaymentStatus(paymentId: any) {
    let contador: number = 0

    const intervalo = setInterval(() => {
      this.http.get(`https://localhost:8443/api/pagamento/pix/status/${paymentId}`)
        .subscribe((data: any) => {
          contador += 5

          if (contador > 180) {
            clearInterval(intervalo)
            localStorage.setItem('compraPendente', 'true');
            this.router.navigate(['/compra-pendente']);
            return
          }
          
          if (data.status === 'approved') {
            clearInterval(intervalo)
            this.router.navigate(['/compra-finalizada']);
          } else if (data.status === 'rejected') {
            clearInterval(intervalo)
            localStorage.setItem('compraPendente', 'true');
            this.router.navigate(['/compra-pendente']);
          }
        }, (error) => {
          console.error('Erro ao verificar status do pagamento:', error);
        });
    }, 5000);
  }

  processPixPayment(paymentData: any) {
    if (this.mock) {
      this.isLoadingPagto = true

      this.qrCodePix = '00020101021226830014BR.GOV.BCB.PIX520400005303986540512.345802BR5920NOME DO RECEBEDOR6008BRASILIA62070503***6304ABCD';

      setTimeout(() => {
        this.isLoadingPagto = false
        this.cartService.cleanCart()
        localStorage.setItem('compraPendente', 'true')
        this.snackbarService.show('Sua compra está pendente!', 'error')
        this.router.navigate(['/compra-pendente'])
      }, 60000);
      return
    }

    this.http.post('https://localhost:8443/api/pagamento/pix', paymentData).subscribe(
      (response: any) => {
        if (response && response.point_of_interaction.transaction_data.qr_code) {
          
          this.pixPaymentId = response.id;
          
          this.qrCodePix = response.point_of_interaction.transaction_data.qr_code;
          this.copiaECola = response.point_of_interaction.transaction_data.qr_code;

          this.isLoadingPagto = false;

          if (this.pixPaymentId) {
            this.checkPixPaymentStatus(this.pixPaymentId);
          }
        } else {
          this.snackbarService.show('Erro ao gerar pagamento PIX', 'error');
          this.isLoadingPagto = false;
        }
      },
      (error) => {
        console.error('Erro ao processar pagamento PIX:', error);
        this.snackbarService.show('Erro ao processar pagamento PIX', 'error');
        this.isLoadingPagto = false;
      }
    );
  }

  gerarPix() {
    const identificationNumber = (document.getElementById('identificationNumber') as HTMLInputElement).value;
    const email = (document.getElementById('cardholderEmail') as HTMLInputElement).value;
    const nome = (document.getElementById('nomeCompleto') as HTMLInputElement).value;

    if (identificationNumber === '' || email === '' || nome === '') {
      this.snackbarService.show('Favor preencher Todas as informações do formulário para gerar o QRCode', 'error')
      this.isLoadingPagto = false
      return
    }

    const paymentData = {
      transactionAmount: this.totalPrice,
      description: 'Compra no site',
      payerEmail: email,
      payerFirstName: nome,
      payerCpf: identificationNumber,
    };

    this.isLoadingPagto = true;
    this.processPixPayment(paymentData);
  }

  copiarCodigoPix() {
    navigator.clipboard.writeText(this.copiaECola).then(() => {
      this.snackbarService.show('Código Pix Copia e Cola copiado!', 'info');
    }).catch(err => {
      console.error('Erro ao copiar código Pix', err);
    });
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
    const amountElement = document.getElementById('product-price');
    const amount = (amountElement?.textContent || '0').replace('R$ ', '').replace(',', '.');

    try {
      const installments = await this.mercadopago.getInstallments({
        amount: amount,
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

    const transactionAmount = this.totalPrice;
    let installments = null;
    if (this.selectedPaymentMethod === 'credito') {
      installments = (document.getElementById('installmentsSelect') as HTMLSelectElement).value
    }
    else {
      installments = 1
    }
    const email = (document.getElementById('cardholderEmail') as HTMLInputElement).value;
    const identificationType = (document.getElementById('docType') as HTMLSelectElement).value;
    const identificationNumber = (document.getElementById('identificationNumber') as HTMLInputElement).value;
    const productDescription = this.cartItems.map(item => item.descricao).join(', ');

    let issuerId = null
    if (this.issuerId !== undefined) {
      issuerId = this.issuerId
    }
    else {
      issuerId = (document.getElementById('issuerSelect') as HTMLInputElement).value;
    }

    let paymentMethodSelect = null
    if (this.paymentMethodId !== undefined) {
      paymentMethodSelect = this.paymentMethodId
    }
    else {
      paymentMethodSelect = (document.getElementById('paymentMethodSelect') as HTMLInputElement).value;
    }

    const paymentData = {
        token: token.id,
        transactionAmount,
        installments,
        issuerId: issuerId,
        paymentMethodId: paymentMethodSelect,
        productDescription: productDescription,
        payer: {
            email,
            identification: {
                type: identificationType,
                number: identificationNumber,
            },
        },
        paymentType: this.selectedPaymentMethod
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

      if (this.mock) {
        this.isLoadingPagto = true

        setTimeout(() => {
          this.isLoadingPagto = false
          this.cartService.cleanCart()
          localStorage.setItem('compraFinalizada', 'true')
          this.snackbarService.show('Compra finalizada com sucesso!', 'info')
          this.router.navigate(['/compra-finalizada'])
        }, 3000);
        return
      }

      const { installments, ...paymentDataWithoutInstallments } = paymentData;
      this.isLoadingPagto = true
      const paymentRequest = this.paymentMethodId === 'debito' 
      ? this.http.post('https://localhost:8443/api/pagamento/cartao', paymentDataWithoutInstallments, { headers })
      : this.http.post('https://localhost:8443/api/pagamento/cartao', paymentData, { headers });

      paymentRequest.subscribe({
        next: response => {
          this.isLoadingPagto = false;
          localStorage.setItem('compraFinalizada', 'true');
          
          this.cartService.cleanCart();

          this.router.navigate(['compra-finalizada']);

          const successMessage = this.paymentMethodId === 'debito'
            ? 'Pagamento via débito realizado com sucesso!'
            : 'Pagamento realizado com sucesso!';

          this.snackbarService.show(successMessage, 'info');
        },
        error: error => {
          this.isLoadingPagto = false;
          this.snackbarService.show('Erro ao processar pagamento', 'error');
          console.error('Erro ao processar pagamento:', error);
        }
      });
    } catch (error) {
      this.snackbarService.show('Erro ao processar pagamento', 'error')
      console.error('Exceção ao processar pagamento:', error);
    }
  }

}

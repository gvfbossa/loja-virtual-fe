// cart-state.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {

  private enderecoSubject = new BehaviorSubject<string>(''); // Inicializa com string vazia
  endereco$ = this.enderecoSubject.asObservable(); 
  
  private totalPrice: number = 0;
  private cepDestino: string = '';
  private selectedPaymentMethod = ''

  constructor(private http: HttpClient) {}

  // Métodos para definir os dados
  setCartState(totalPrice: number, cepDestino: string, selectedPaymentMethod: string): void {
    this.totalPrice = totalPrice;
    this.cepDestino = cepDestino;
    this.selectedPaymentMethod = selectedPaymentMethod
  }

  // Métodos para acessar os dados
  getTotalPrice(): number {
    return this.totalPrice;
  }

  getCepDestino(): string {
    return this.cepDestino;
  }

  getSelectedPaymentMethod(): string {
    return this.selectedPaymentMethod
  }

  buscarEnderecoPorCep(cep: string): Promise<string> {
    const url = `https://viacep.com.br/ws/${cep}/json/`;
  
    return firstValueFrom(
      this.http.get<any>(url)
    ).then((data) => {
      if (!data.erro) {
        const enderecoFormatado = `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`;
        this.enderecoSubject.next(enderecoFormatado);
        console.log('endereco checkoutService ', enderecoFormatado);
        return enderecoFormatado;
      } else {
        console.error('CEP não encontrado');
        throw new Error('CEP não encontrado');
      }
    }).catch((error) => {
      console.error('Erro ao buscar endereço', error);
      throw error;
    });
  }

}

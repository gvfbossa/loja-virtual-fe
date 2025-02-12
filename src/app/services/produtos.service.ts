import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProdutosService {
  constructor() {}

  getProdutos() {
    return [
      {
        id: 1,
        nome: 'Cocada de Corte Tradicional',
        preco: 7.99,
        categoria: 'Cocada de Corte',
        foto: 'assets/images/produto-corte-tradicional.jpeg',
        descricao: 'Deliciosa cocada branca tradicional, feita com coco fresco e os melhores ingredientes.'
      },
      {
        id: 2,
        nome: 'Cocada de Corte Prestígio',
        preco: 7.99,
        categoria: 'Cocada de Corte',
        foto: 'assets/images/produto-corte-prestigio.jpeg',
        descricao: 'Nossa cocada Tradicional coberta com uma deliciosa camada de chocolate meio amargo.'
      },
      {
        id: 3,
        nome: 'Cocada de Corte Doce de Leite',
        preco: 8.49,
        categoria: 'Cocada de Corte',
        foto: 'assets/images/produto-corte-doce-de-leite.jpeg',
        descricao: 'Cocada tradicional recheada com Doce de Leite da melhor qualidade.'
      },
    ];
  }

  getProdutoById(id: number): any {
    return this.getProdutos().find(p => p.id === id )
  }
}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProdutosService {
  constructor() {}

  getProdutos() {
    return [
      { id: 1, nome: 'Website Pessoal', preco: 199.99, peso: 100, categoria: 'site', subcategoria: 'pessoal', foto: 'assets/images/sites3.jpg', descricao: 'Construímos a sua identidade Digital para você entrar de vez no mundo digital!' },
      { id: 2, nome: 'Website Empresarial', preco: 249.50, peso: 120, categoria: 'site', subcategoria: 'empresa', foto: 'assets/images/sites2.jpg', descricao: 'Um site profissional para expandir a presença online do seu negócio e atrair novos clientes.' },
      { id: 3, nome: 'Landing Page', preco: 179.75, peso: 90, categoria: 'site', subcategoria: 'landing-page', foto: 'assets/images/sites1.jpg', descricao: 'Uma página de alto impacto para capturar leads e aumentar suas conversões rapidamente.' },
      { id: 4, nome: 'Sistema de Automação', preco: 398.99, peso: 100, categoria: 'sistema', subcategoria: 'automacao', foto: 'assets/images/sistemas2.jpg', descricao: 'Com nossos sistemas, você irá automatizar processos Transformando o Complexo em Simplicidade!' },
      { id: 5, nome: 'App para sua Pizzaria', preco: 1219.49, peso: 100, categoria: 'app', subcategoria: 'pizzaria', foto: 'assets/images/apps1.jpg', descricao: 'Simplificamos a complexidade e colocamos o poder da tecnologia em suas mãos.' },
      { id: 6, nome: 'Apps para suas Entregas', preco: 1349.99, peso: 110, categoria: 'app', subcategoria: 'entregas', foto: 'assets/images/apps2.jpg', descricao: 'Um aplicativo eficiente para gerenciar entregas e otimizar sua logística.' },
      { id: 7, nome: 'App para você se conectar', preco: 1499.90, peso: 105, categoria: 'app', subcategoria: 'conectividade', foto: 'assets/images/apps3.jpg', descricao: 'Facilitamos a conexão entre pessoas e negócios com um app moderno e intuitivo.' },
    ];
  }

  getProdutoById(id: number): any {
    return this.getProdutos().find(p => p.id === id )
  }
}

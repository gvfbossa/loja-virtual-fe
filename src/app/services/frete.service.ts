import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FreteService {
  
  constructor(private http: HttpClient) { }

  mock = true

  calcularFrete(cepOrigem: string, cepDestino: string, cartItems: any[]): Observable<any> {
    if (this.mock) {
      return of([
        {
          name: "SEDEX",
          price: 15.90,
          company: {
            name: "Correios",
            picture: "assets/images/correios-logo.png"
          }
        },
        {
          name: "PAC",
          price: 10.50,
          company: {
            name: "Correios",
            picture: "assets/images/correios-logo.png"
          }
        }
      ]).pipe(delay(1000));
    }
    
    const url = '/melhorenvio-api/api/v2/me/shipment/calculate';
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'User-Agent': 'Aplicação contato.bossaws@gmail.com',
      'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5NTYiLCJqdGkiOiI0YWNhMzA5MzFhYTNjNDA0YTE5MjY5ZDFmODYwMjg4ZGZhZDUxNTgwMDY5ZWY4ZmQxYWJlNGRlNjc4YjMxNThkZDRjYTIwMDM1MDc2MTQ0ZiIsImlhdCI6MTc0MDcwMjc0My44MTUxMDcsIm5iZiI6MTc0MDcwMjc0My44MTUxMSwiZXhwIjoxNzcyMjM4NzQzLjgwNjQ3Miwic3ViIjoiOWU1MGQ0MzgtNTQ0Zi00Y2JkLWExMTgtMDM2Zjg0MTk0YzRhIiwic2NvcGVzIjpbInNoaXBwaW5nLWNhbGN1bGF0ZSJdfQ.qPKA5N5J2RGCnBdYVzsu1rmGprccYksJPvn7eTKzwUGg_1XIFVtg5MFWxXC2WTgBiXVZiI0NMYlPBCi-h21iSj7U1Iq2kW50GC8MKMmX60jv-13IRW8ZVNaXgZbJOfx3zT23iDIaYs1NFhEsjK3V7uzG-INTRq74wh3be3etCiWeYE6EGe1aLFT9atF61FNhJuBstZQMraCFw2J0-xEFdGOTBBzL0-ocBqaUg0C9roVzQG7RaCPwZvwBVa-Eru1L49rVCsYPcP_-EzWOorb6vbVzNWUEoDKVvXpIeaCyUKLNBfysHp0seDKZ2jGf2f4HRWqN9Huvh1IRDcdapg0XpLNNyHUekNlcTclxzc3Jl6KcfiFge8ZlRRp9GsCsoNM7pSKsOquJjSz9xzj9L6Ly3CYpYr61WRWT9u65vXyblPwDdFtJbZ0vHfCex0a8-tmr5dFyaVXXil13AThQw7L4vjmHoo7UCoHb0AFFVo4buah8rCf7PzqsrPm8NbDeCqxEBDXg9R6SMgNY3GSo7AKFAiLDoFB-HEo98x0x5lYkcu2untMey76XP712xR3yWVq8rcWJoRUJ9sM2A0FNr00G98AkyeGLMiN7yHk4UBSDnfO6RcQ-BPMa0EuM9HBA_CAdsXNYxhI6qkHtTRNwqwibZy9bIyRck67Er3VXZcKxcr0'
    })

    let peso = 0
    cartItems.forEach(item => {
      peso = peso + item.peso
    }); 
    peso = peso/1000

    console.log('Peso Total dos produtos: ', peso)

    const body = {
      from: { postal_code: cepOrigem },
      to: { postal_code: cepDestino },
      package: {
          height: 15,
          width: 20,
          length: 20,
          weight: peso
      }
    };

    return this.http.post(url, body, { headers });
  }
    
}

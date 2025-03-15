import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  constructor(private snackBar: MatSnackBar) {}

  show(message: string, type: 'info' | 'error') {
    this.snackBar.open(message, '', {
      duration: 3000,  // 3 segundos
      panelClass: type === 'info' ? 'snackbar-info' : 'snackbar-error'
    });
  }
}

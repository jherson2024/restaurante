import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authStatus = new BehaviorSubject<boolean>(this.isLoggedIn());
  authStatus$ = this.authStatus.asObservable();

  private getLocalStorageItem(key: string): string | null {
    return typeof localStorage !== 'undefined' ? localStorage.getItem(key) : null;
  }

  private setLocalStorageItem(key: string, value: string): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, value);
    }
  }

  private removeLocalStorageItem(key: string): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(key);
    }
  }

  private isLoggedIn(): boolean {
    return !!this.getLocalStorageItem('token');
  }

  login(token: string, clienteId: number, clienteNombre: string): void {
    this.setLocalStorageItem('token', token);
    this.setLocalStorageItem('clienteId', clienteId.toString());
    this.setLocalStorageItem('clienteNombre', clienteNombre);
    this.authStatus.next(true);
  }

  logout(): void {
    this.removeLocalStorageItem('token');
    this.removeLocalStorageItem('clienteId');
    this.removeLocalStorageItem('clienteNombre');
    this.authStatus.next(false);
  }

  getClienteNombre(): string | null {
    return this.getLocalStorageItem('clienteNombre');
  }

  getClienteId(): number {
    return parseInt(this.getLocalStorageItem('clienteId') || '0', 10);
  }
}

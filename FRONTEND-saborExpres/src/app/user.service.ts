// user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private authStatus = new BehaviorSubject<boolean>(this.isLoggedIn());
  authStatus$ = this.authStatus.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

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

  login(nombre: string, password: string) {
    return this.http.post<{ token: string, userId: number, nombre: string }>('http://localhost:8000/api/user-login/', { nombre, password })
      .subscribe(
        response => {
          this.setLocalStorageItem('token', response.token);
          this.setLocalStorageItem('userId', response.userId.toString());
          this.setLocalStorageItem('userName', response.nombre);
          this.authStatus.next(true);
          this.router.navigate(['/dashboard']); // Navegar al dashboard después de un login exitoso
        },
        error => {
          console.error('Login failed', error);
        }
      );
  }

  logout(): void {
    this.removeLocalStorageItem('token');
    this.removeLocalStorageItem('userId');
    this.removeLocalStorageItem('userName');
    this.authStatus.next(false);
    this.router.navigate(['/login']);
  }

  getUserName(): string | null {
    return this.getLocalStorageItem('userName');
  }

  getUserId(): number {
    return parseInt(this.getLocalStorageItem('userId') || '0', 10);
  }
}

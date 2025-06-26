import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  public usernameControl: FormControl = new FormControl('', [
    Validators.required,
    Validators.maxLength(15),
  ]);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  @HostListener('document:keydown.enter', ['$event'])
  public login(): void {
    if (this.usernameControl.invalid) {
      return;
    }

    this.authService.login(this.usernameControl.value!);
    this.router.navigate(['/cats']);
  }
}

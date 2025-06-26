import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'top-bar',
  imports: [],
  standalone: true,
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopBarComponent {
  public readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  public logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

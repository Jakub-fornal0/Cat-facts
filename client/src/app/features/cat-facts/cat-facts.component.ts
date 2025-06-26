import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  HostListener,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CatFactsService } from '../../core/services/cat-facts.service';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'cat-facts',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './cat-facts.component.html',
  styleUrls: ['./cat-facts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatFactsComponent implements OnInit {
  private readonly catFactsService = inject(CatFactsService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly facts: WritableSignal<string[]> = signal([]);
  private readonly currentIndex: WritableSignal<number> = signal(0);
  private readonly isLoading: WritableSignal<boolean> = signal(false);
  public readonly currentFact = computed((): string => {
    const facts = this.facts();
    const index = this.currentIndex();
    return facts[index] ?? 'Ładowanie ciekawostki...';
  });

  public ngOnInit(): void {
    this.loadNewFact();
  }

  public logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  @HostListener('window:wheel', ['$event'])
  public onWheel(event: WheelEvent): void {
    if (this.isLoading()) return;

    if (event.deltaY > 0) {
      this.scrollDown();
    } else if (event.deltaY < 0) {
      this.scrollUp();
    }
  }

  private scrollDown(): void {
    if (this.currentIndex() >= this.facts().length - 1) {
      this.loadNewFact();
    } else {
      this.currentIndex.update((i) => i + 1);
    }
  }

  private scrollUp(): void {
    if (this.currentIndex() > 0) {
      this.currentIndex.update((i) => i - 1);
    }
  }

  public loadNewFact(retries: number = 3): void {
    this.isLoading.set(true);

    this.catFactsService.getFact().subscribe({
      next: (fact: string) => {
        if (this.facts().includes(fact)) {
          if (retries > 0) {
            this.loadNewFact(retries - 1);
          } else {
            this.isLoading.set(false);
          }
          return;
        }

        this.facts.update((facts) => [...facts, fact]);
        this.currentIndex.set(this.facts().length - 1);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }
}

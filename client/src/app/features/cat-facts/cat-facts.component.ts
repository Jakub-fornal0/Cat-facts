import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  HostListener,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CatFactsService } from '../../core/services/cat-facts.service';
import { TopBarComponent } from '../../shared/components/top-bar/top-bar.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'cat-facts',
  standalone: true,
  imports: [CommonModule, MatCardModule, TopBarComponent],
  templateUrl: './cat-facts.component.html',
  styleUrls: ['./cat-facts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatFactsComponent implements OnInit {
  private readonly catFactsService = inject(CatFactsService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly facts: WritableSignal<string[]> = signal([]);
  private readonly currentIndex: WritableSignal<number> = signal(0);
  private readonly isLoading: WritableSignal<boolean> = signal(false);
  private readonly errorOccurred: WritableSignal<boolean> = signal(false);
  public readonly currentFact = computed((): string => {
    if (this.errorOccurred()) {
      return 'Coś poszło nie tak... Spróbuj ponownie.';
    }

    const facts = this.facts();
    const index = this.currentIndex();
    return facts[index] ?? 'Ładowanie ciekawostki...';
  });

  public ngOnInit(): void {
    this.loadNewFact();
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
    this.errorOccurred.set(false);

    this.catFactsService
      .getFact()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (fact: string) => {
          if (this.facts().includes(fact)) {
            if (retries > 0) {
              this.loadNewFact(retries - 1);
            } else {
              this.isLoading.set(false);
              this.errorOccurred.set(true);
            }
            return;
          }

          this.facts.update((facts) => [...facts, fact]);
          this.currentIndex.set(this.facts().length - 1);
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
          this.errorOccurred.set(true);
        },
      });
  }
}

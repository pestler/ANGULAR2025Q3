import {
  Directive,
  ElementRef,
  inject,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
} from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { fromEvent, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Directive({
  selector: '[appCloseSidebarOnOutsideClick]',
  standalone: true,
})
export class CloseSidebarOnOutsideClickDirective implements OnInit, OnDestroy {
  private el = inject(ElementRef);
  private router = inject(Router);
  @Output() close = new EventEmitter<void>();

  private subs = new Subscription();

  ngOnInit(): void {
    const clickSub = fromEvent<MouseEvent>(document, 'click')
      .pipe(
        filter(
          (event) => !this.el.nativeElement.contains(event.target as Node),
        ),
      )

      .subscribe(() => this.close.emit());

    const navSub = this.router.events
      .pipe(filter((e) => e instanceof NavigationStart))

      .subscribe(() => this.close.emit());

    this.subs.add(clickSub);
    this.subs.add(navSub);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}

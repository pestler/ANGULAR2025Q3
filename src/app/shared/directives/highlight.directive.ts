import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  standalone: true,
})
export class HighlightDirective implements OnChanges {
  @Input('appHighlight') isActive: boolean = false;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
  ) {}

  ngOnChanges(): void {
    const glowClass = 'highlight-glow';

    if (this.isActive) {
      this.renderer.addClass(this.el.nativeElement, glowClass);
    } else {
      this.renderer.removeClass(this.el.nativeElement, glowClass);
    }
  }
}

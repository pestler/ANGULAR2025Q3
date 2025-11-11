/* eslint-disable no-unused-vars */
import { DOCUMENT } from '@angular/common';
import {
  Inject,
  Injectable,
  Renderer2,
  RendererFactory2,
  signal,
} from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';

@Injectable({
  providedIn: 'root',
})
export class ThemeManagerService {
  isDarkMode = signal<boolean>(false);
  private renderer: Renderer2;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private rendererFactory: RendererFactory2,
    private overlayContainer: OverlayContainer,
  ) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  loadTheme(): void {
    const savedTheme = localStorage.getItem('theme');
    const themeToSet = savedTheme === 'dark';
    this.setTheme(themeToSet);
  }

  toggleTheme(): void {
    this.setTheme(!this.isDarkMode());
  }

  private setTheme(isDark: boolean): void {
    this.isDarkMode.set(isDark);

    const themeToSet = isDark ? 'dark' : 'light';
    this.renderer.setAttribute(this.document.body, 'data-theme', themeToSet);
    this.overlayContainer
      .getContainerElement()
      .setAttribute('data-theme', themeToSet);

    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }
}

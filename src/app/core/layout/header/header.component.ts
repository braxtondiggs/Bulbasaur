import { Component, ChangeDetectionStrategy } from '@angular/core';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  public setTheme(theme: string): void {
    // Apply theme to both html and body elements for better DaisyUI support
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    localStorage.setItem('theme-manual', 'true');
  }
}

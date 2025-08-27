import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

// Icons
import { NgIconsModule } from '@ng-icons/core';

// Directives
import { AnimateOnScrollDirective } from './directives/animate-on-scroll.directive';
import { LazyLoadFadeDirective } from './directives/lazy-load-fade.directive';
import { LazyBackgroundFadeDirective } from './directives/lazy-background-fade.directive';

// Pipes
import { DateFormatPipe, DifferencePipe, ParsePipe } from './pipes/date.pipe';
import { SkillPipe } from './pipes/skill.pipe';

// Services are provided in root, so no need to include them here

const SHARED_COMPONENTS = [
  // Add shared components here when created
];

const SHARED_DIRECTIVES = [
  AnimateOnScrollDirective,
  LazyLoadFadeDirective,
  LazyBackgroundFadeDirective
];

const SHARED_PIPES = [
  DateFormatPipe,
  DifferencePipe,
  ParsePipe,
  SkillPipe
];

@NgModule({
  declarations: [
    ...SHARED_COMPONENTS,
    ...SHARED_DIRECTIVES,
    ...SHARED_PIPES
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgIconsModule
  ],
  exports: [
    // Re-export commonly used modules
    CommonModule,
    ReactiveFormsModule,
    NgIconsModule,
    // Export our shared components, directives, and pipes
    ...SHARED_COMPONENTS,
    ...SHARED_DIRECTIVES,
    ...SHARED_PIPES
  ]
})
export class SharedModule { }

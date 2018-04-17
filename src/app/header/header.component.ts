import { Component } from '@angular/core';

@Component({
  selector: 'msw-header',
  templateUrl: './header.component.html'
})

export class HeaderComponent {
  percentFormComplete: number = 20;

  constructor() {
  }

}

import { Component, Injectable } from '@angular/core';
import { FormDataService } from '../data/formData.service';
import { FormData } from '../data/formData.model';

@Component({
  selector: 'msw-header',
  templateUrl: './header.component.html'
})

@Injectable()
export class HeaderComponent {
  percentFormComplete: number = 12;

  constructor(private formDataService: FormDataService, private formData: FormData) {
  }

  updatePercent() {
    console.log('update trigg');
  }

}

import { Component, OnInit, Input } from '@angular/core';

import { FormDataService } from './data/formData.service';

@Component({
  selector: 'multi-step-wizard-app', 
  templateUrl: './app.component.html'
})

export class AppComponent implements OnInit {
  title = 'Multi-Step Wizard';
  @Input() formData;

  constructor(private formDataService: FormDataService) {
  }

  scrollDown() {
    window.scrollBy({
      top: 300, // could be negative value
      left: 0,
      behavior: 'smooth'
    });
  }

  ngOnInit() {
    this.formData = this.formDataService.getFormData();
    console.log(this.title + ' loaded!');
  }

}

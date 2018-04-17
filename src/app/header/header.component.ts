import { Component, OnInit, Input } from '@angular/core';
import { FormDataService } from '../data/formData.service';

@Component({
  selector: 'msw-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {
  @Input() formData;

  constructor(private formDataService: FormDataService) {
  }

  ngOnInit() {
    this.formData = this.formDataService.getFormData();
  }

}

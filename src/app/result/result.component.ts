import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Result } from '../data/formData.model';
import { FormData } from '../data/formData.model';
import { FormDataService } from '../data/formData.service';

@Component({
    selector: 'mt-wizard-result',
    templateUrl: './result.component.html',
})

export class ResultComponent implements OnInit {
    title = 'Review your application';
    @Input() formData: FormData;
    result: Result;
    form: any;
    isFormValid: boolean = false;

    constructor(private router: Router, private formDataService: FormDataService) {
    }

    ngOnInit() {
        this.result = this.formDataService.getResult();
        this.formData = this.formDataService.getFormData();
        this.isFormValid = this.formDataService.isFormValid();

        console.log('Result feature loaded!');
        console.log(this.result)
    }

    save(form: any): boolean {
        if (!form.valid) {
            return false;
        }

        this.formDataService.setResult(this.result);
        return true;
    }

    submit(form: any) {
        window.scrollTo(0, 0);
        if (this.save(form)) {
            // Navigate to the result page
            //this.router.navigate(['/personal']);
            alert("FINISHED");
        }
    }

    // submit() {
    //     alert('Excellent Job!');
    //     this.formData = this.formDataService.resetFormData();
    //     this.isFormValid = false;
    // }

}
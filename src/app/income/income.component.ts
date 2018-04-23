import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Input } from '@angular/core';
import { Income } from '../data/formData.model';
import { FormDataService } from '../data/formData.service';
import { NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'mt-wizard-income',
    templateUrl: './income.component.html',
})

export class IncomeComponent implements OnInit {
    title = 'Please provide information about your income';
    income: Income;
    form: any;

    constructor(private router: Router, private formDataService: FormDataService, private config: NgbTooltipConfig) {
        config.placement = 'right';
        config.triggers = 'hover';
    }

    scrollToEmployerName() {
        // document.querySelector('#employer-name').scrollIntoView({
        //     behavior: 'smooth'
        // });
        window.scrollBy({
            top: 50, // could be negative value
            left: 0,
            behavior: 'smooth'
        });
    }

    scrollToPayFrequency() {
        // document.querySelector('.radio-payFrequency').scrollIntoView({
        //     behavior: 'smooth'
        // });
        window.scrollBy({
            top: 50, // could be negative value
            left: 0,
            behavior: 'smooth'
        });
    }

    forceNumeric($event) {
        $event.target.value = $event.target.value.replace(/[^0-9\.]+/g, '');
    }

    ngOnInit() {
        this.income = this.formDataService.getIncome();
    }

    save(form: any): boolean {
        if (!form.valid) {
            return false;
        }

        this.formDataService.setIncome(this.income);
        return true;
    }

    goToPrevious(form: any) {
        // Scrolls to top of the page
        window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });

        if (this.save(form)) {
            // Navigate to the personal page
            document.getElementById('one').classList.remove('completed-tabs')
            this.formDataService.decrementPercentFormData();
            this.router.navigate(['/personal']);
        }
    }

    goToNext(form: any) {
        // Scrolls to top of the page
        window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
        if (this.save(form)) {
            // Navigate to the address page
            document.getElementById('two').classList.add('completed-tabs')
            this.formDataService.updatePercentFormData();
            this.router.navigate(['/address']);
        }
    }
}


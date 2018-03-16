import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Input } from '@angular/core';
// import { 
//     trigger,
//     state,
//     style,
//     animate,
//     transition
// } from '@angular/animations';
import { Personal } from '../data/formData.model';
import { FormDataService } from '../data/formData.service';
import { ForbiddenValidatorDirective } from '../shared/custom-validations.directive';
//import { FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
    selector: 'mt-wizard-personal', 
    templateUrl: './personal.component.html',
    // animations: [
    //     trigger('flyInOut', [
    //         state('in', style({ transform: 'translateX(0)' })),
    //         transition('void => *', [
    //             style({ transform: 'translateX(-100%)' }),
    //             animate(100)
    //         ]),
    //         transition('* => void', [
    //             animate(100, style({ transform: 'translateX(100%)' }))
    //         ])
    //     ])
    // ]
})

export class PersonalComponent implements OnInit {
    title1 = "Tell us how much you'd like to borrow.";
    title2 = 'Please tell us your name.';
    title3 = "Please fill in your personal details.";
    personal: Personal;
    form: any;

    constructor(private router: Router, private formDataService: FormDataService) {
    }

    ngOnInit() {
        this.personal = this.formDataService.getPersonal();
        console.log('Personal feature loaded!');
        console.log(this.personal);
    }

    smoothScroll () {
        let element: HTMLElement = document.getElementById('personal-info');
        (element).scrollIntoView({
            behavior: 'smooth'
        });
    }

    save(form: any): boolean {
        if (!form.valid) {
            return false;
        }

        this.formDataService.setPersonal(this.personal);
        return true;
    }

    goToNext(form: any) {
        window.scrollTo(0, 0);
        if (this.save(form)) {
            // Navigate to the income page
            this.router.navigate(['/income']);
        }
    }
}


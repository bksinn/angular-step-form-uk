import { Directive, forwardRef, Input, OnChanges, SimpleChanges, Component } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, NG_ASYNC_VALIDATORS, Validator, ValidatorFn, Validators, ValidationErrors } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { EventEmitter, HostListener, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// Validate phone numbers

function validatePhoneNumber(): ValidatorFn {
    return (c: AbstractControl) => {
        c.markAsPristine();
        let phoneNumberPattern = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
        let isValid = phoneNumberPattern.test(c.value);
        if (isValid) {
            return null;
        }
        else {
            if (c.value !== null && c.value.length) {
                c.markAsDirty();
            }
            return {
                validatePhone: {
                    valid: false
                }
            };
        }
    }
}

@Directive({
    selector: '[validatePhone][ngModel]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: PhoneNumberValidator, multi: true }
    ]
})
export class PhoneNumberValidator implements Validator {
    validator: ValidatorFn;

    constructor() {
        this.validator = validatePhoneNumber();
    }

    validate(c: FormControl) {
        return this.validator(c);
    }

    //Auto-format phone number
    @Output() ngModelChange: EventEmitter<any> = new EventEmitter();
    value: any;

    @HostListener('input', ['$event']) onInputChange($event) {
        this.value = $event.target.value;
        var v = this.value.replace(/\D/g, '');
        if (v.match(/^\d{3}$/) !== null) {
            this.value = '(' + v + ') ';
        } else if (v.match(/^(\d{3})(\d{3})$/) !== null) {
            this.value += '-';
        }

        //Adds formatting onfinal input
        let m = v.match(/^(\d{3})(\d{3})(\d{4})$/);

        if (m) this.value = '(' + m[1] + ") " + m[2] + "-" + m[3];

        this.ngModelChange.emit(this.value);
    }

}

//Validate email
//pattern = "^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$"
function validateEmail(): ValidatorFn {
    return (c: AbstractControl) => {
        let emailPattern = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        let isValid = emailPattern.test(c.value);

        if (isValid) {
            return null;
        } else {
            return {
                validateEmail: {
                    valid: false
                }
            };
        }
    }
}

@Directive({
    selector: '[validateEmail][ngModel]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: EmailValidator, multi: true }
    ]
})
export class EmailValidator implements Validator {
    validator: ValidatorFn;

    constructor() {
        this.validator = validateEmail();
    }

    validate(c: FormControl) {
        return this.validator(c);
    }

}

//Validate SSN
//pattern="^(\d{3}-\d{2}-\d{4})|(\d{3}\d{2}\d{4})$" 
function validateSSN(): ValidatorFn {
    return (c: AbstractControl) => {
        let ssnPattern = /^(?!000)([0-6]\d{2}|7([0-6]\d|7[012]))([ -])?(?!00)\d\d([ -|])?(?!0000)\d{4}$/;
        let isValid = ssnPattern.test(c.value);

        if (isValid) {
            return null;
        } else {
            return {
                validateSSN: {
                    valid: false
                }
            };
        }
    }
}

@Directive({
    selector: '[validateSSN][ngModel]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: SSNValidator, multi: true }
    ]
})
export class SSNValidator implements Validator {
    validator: ValidatorFn;

    constructor() {
        this.validator = validateSSN();
    }

    validate(c: FormControl) {
        return this.validator(c);
    }


    //Auto-format SSN
    @Output() ngModelChange: EventEmitter<any> = new EventEmitter();
    value: any;

    @HostListener('input', ['$event']) onInputChange($event) {
        this.value = $event.target.value;
        var val = this.value.replace(/\D/g, '');
        var newVal = '';
        if (val.length > 4) {
            this.value = val;
        }
        if ((val.length > 3) && (val.length < 6)) {
            newVal += val.substr(0, 3) + '-';
            val = val.substr(3);
        }
        if (val.length > 5) {
            newVal += val.substr(0, 3) + '-';
            newVal += val.substr(3, 2) + '-';
            val = val.substr(5);
        }
        newVal += val;
        this.value = newVal.substring(0, 11);

        this.ngModelChange.emit(this.value);
    }

}

//Validate Date of Birth (over 18)
function getAge(dateString) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age > 18;
}

function validateAge(): ValidatorFn {
    return (c: AbstractControl) => {
        //Validate proper format first MM/DD/YYYY
        const datePattern = /^\d{2}\/\d{2}\/\d{4}$/;
        datePattern.test(c.value);

        const today = new Date();
        const birthDate = new Date(c.value);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        let isValid = age >= 18 && age <= 110;
        if (isValid && datePattern.test(c.value)) {
            return null;
        } else {
            return {
                validateDOB: {
                    valid: false
                }
            };
        }
    }
}

@Directive({
    selector: '[validateDOB][ngModel]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: DOBValidator, multi: true }
    ]
})
export class DOBValidator implements Validator {
    validator: ValidatorFn;

    constructor() {
        this.validator = validateAge();
    }

    validate(c: FormControl) {
        return this.validator(c);
    }

    @Output() ngModelChange: EventEmitter<any> = new EventEmitter();
    value: any;

    //Auto-format DOB
    @HostListener('input', ['$event']) onInputChange($event) {
        this.value = $event.target.value;
        var v = this.value;
        if (v.match(/^\d{2}$/) !== null) {
            this.value = v + '/';
        } else if (v.match(/^\d{2}\/\d{2}$/) !== null) {
            this.value = v + '/';
        }

        this.ngModelChange.emit(this.value);
    }

}

//Validate zip code
// function validateZip(): ValidatorFn {
//     return (c: AbstractControl) => {
//         let zipPattern = /^\d{5}(?:[-\s]\d{4})?$/;
//         let isValid = zipPattern.test(c.value);

//         if (zipPattern) {
//             return null;
//         } else {
//             return {
//                 validateZip: {
//                     valid: false
//                 }
//             };
//         }
//     }
// }

@Directive({
    selector: '[validateZip][ngModel]',
    providers: [
        { provide: NG_ASYNC_VALIDATORS, useExisting: forwardRef(() => ZipCodeValidator), multi: true }
    ]
})
export class ZipCodeValidator implements Validator {
    //validator: ValidatorFn;

    constructor(private http: HttpClient) {
        //this.validator = validateZip();        
    }

    validate(c: AbstractControl) {
        return new Promise(resolve => {
            setTimeout(() => {
                if (c.value != null && c.value.length === 5 && Number(c.value)) {
                    this.http.get('https://www.pingyo.com/validate/locales/zipcode/' + c.value).subscribe(
                        res => {
                            if (res) {
                                return resolve(null);
                            }
                            else {
                                return resolve({
                                    validateZip: {
                                        valid: false
                                    }
                                })
                            }
                        },
                        msg => {
                            //console.error(`Error: ${msg.status} ${msg.statusText}`)
                            return resolve({
                                validateZip: {
                                    valid: false
                                }
                            });
                        }
                    )
                }
                else {
                    return resolve({
                        validateZip: {
                            valid: false
                        }
                    })
                }
            })
        })
    }
}

// Validate ABA/Routing number
function validateABA(): ValidatorFn {
    return (c: AbstractControl) => {
        let userInput = String(c.value);

        let i, n, t, s;

        // First, remove any non-numeric characters.
        //s = userInput.replace(/\D/g, ''); ==>Alternative option to for loop
        t = "";
        for (i = 0; i < userInput.length; i++) {
            s = parseInt(userInput.charAt(i), 10);
            if (s >= 0 && s <= 9)
                t = t + s;
        }

        // Check the length, it should be nine digits (or eight for certain banks, i.e. Bank of America).

        if (t.length !== 9) {
            return {
                validateABA: {
                    valid: false
                }
            }
        }

        // Now run through each digit and calculate the total.
        n = 0;
        for (i = 0; i < t.length; i += 3) {
            n += parseInt(t.charAt(i), 10) * 3
                + parseInt(t.charAt(i + 1), 10) * 7
                + parseInt(t.charAt(i + 2), 10);
        }

        //If the resulting sum is an even multiple of ten (but not zero),
        //the aba routing number is good.

        if (n != 0 && n % 10 == 0)
            return null;
        else {
            return {
                validateABA: {
                    valid: false
                }
            }
        }
    }
}

@Directive({
    selector: '[validateABA][ngModel]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: ABARoutingValidator, multi: true }
    ]
})

export class ABARoutingValidator implements Validator {
    validator: ValidatorFn;

    constructor() {
        this.validator = validateABA();
    }

    validate(c: FormControl) {
        return this.validator(c);
    }

}

@Directive({
    selector: '[validateAccountNumber]',
    providers: [{ provide: NG_VALIDATORS, useExisting: AccountNumberValidator, multi: true }]
})
export class AccountNumberValidator implements Validator {

    validate(c: FormControl): ValidationErrors {
        const validateAccountNumber = /^\d{3,3}-\d{3,3}-\d{3,3}$/.test(c.value);
        const message = {
            'validateAccountNumber': {
                'message': 'The phone number must be valid (XXX-XXX-XXX, where X is a digit)'
            }
        };
        return validateAccountNumber ? null : message;
    }
}

//Force uppercase

@Directive({
    selector: '[ngModel][uppercase]'
})
export class UppercaseDirective {
    @Output() ngModelChange: EventEmitter<any> = new EventEmitter();
    value: any;

    @HostListener('input', ['$event']) onInputChange($event) {
        this.value = $event.target.value.toLowerCase().replace(/([^a-z]|^)([a-z])(?=[a-z]{0})/g, function (_, g1, g2) {
            return g1 + g2.toUpperCase();
        });
        this.ngModelChange.emit(this.value);
    }
}

function validateState(): ValidatorFn {
    return (c: AbstractControl) => {
        const states = ['Alabama', 'Alaska', 'American Samoa', 'Arizona', 'Arkansas', 'California', 'Colorado',
            'Connecticut', 'Delaware', 'District Of Columbia', 'Federated States Of Micronesia', 'Florida', 'Georgia',
            'Guam', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine',
            'Marshall Islands', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana',
            'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
            'Northern Mariana Islands', 'Ohio', 'Oklahoma', 'Oregon', 'Palau', 'Pennsylvania', 'Puerto Rico', 'Rhode Island',
            'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virgin Islands', 'Virginia',
            'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
        const stateAbbrev = ['AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FM', 'FL', 'GA', 'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MH', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'MP', 'OH', 'OK', 'OR', 'PW', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VI', 'VA', 'WA', 'WV', 'WI', 'WY'];
        //let isValid = emailPattern.test(c.value);
        let isValid = states.find((element) => c.value == element) || stateAbbrev.find((element) => c.value == element || c.value == element.toLowerCase());
        if (isValid) {
            return null;
        } else {
            return {
                validateState: {
                    valid: false
                }
            };
        }
    }
}

@Directive({
    selector: '[validateState][ngModel]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: StateValidator, multi: true }
    ]
})
export class StateValidator implements Validator {
    validator: ValidatorFn;

    constructor() {
        this.validator = validateState();
    }

    validate(c: FormControl) {
        return this.validator(c);
    }

}

function validateMonthyAmount(): ValidatorFn {
    return (c: AbstractControl) => {
        let isValid = c.value >= 500

        if (isValid) {
            return null;
        } else {
            return {
                validateMonthyAmount: {
                    valid: false
                }
            };
        }
    }
}

@Directive({
    selector: '[validateMonthlyAmount][ngModel]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: MonthlyAmountValidator, multi: true }
    ]
})
export class MonthlyAmountValidator implements Validator {
    validator: ValidatorFn;

    constructor() {
        this.validator = validateMonthyAmount();
    }

    validate(c: FormControl) {
        return this.validator(c);
    }

}

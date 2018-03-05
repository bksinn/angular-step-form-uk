import { Directive, Input, OnChanges, SimpleChanges, Component } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator, ValidatorFn, Validators, ValidationErrors } from '@angular/forms';
import { FormControl } from '@angular/forms';

/** A hero's name can't match the given regular expression */
// Testing validation function
export function forbiddenNameValidator(nameRe: RegExp): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
        const forbidden = nameRe.test(control.value);
        return forbidden ? { 'forbiddenName': { value: control.value } } : null;
    };
}

@Directive({
    selector: '[appForbiddenName][ngModel]',
    providers: [{ provide: NG_VALIDATORS, useExisting: ForbiddenValidatorDirective, multi: true }]
})
export class ForbiddenValidatorDirective implements Validator {
    @Input('appForbiddenName') forbiddenName: string;

    validate(control: AbstractControl): { [key: string]: any } {
        return this.forbiddenName ? forbiddenNameValidator(new RegExp(this.forbiddenName, 'i'))(control)
            : null;
    }
}

// testing validation function
function validateJuriNameFactory(): ValidatorFn {
    return (c: AbstractControl) => {

        let isValid = c.value === 'Juri';

        if (isValid) {
            return null;
        } else {
            return {
                juriName: {
                    valid: false
                }
            };
        }

    }
}

@Directive({
    selector: '[juriName][ngModel]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: JuriNameValidator, multi: true }
    ]
})
export class JuriNameValidator implements Validator {
    validator: ValidatorFn;

    constructor() {
        this.validator = validateJuriNameFactory();
    }

    validate(c: FormControl) {
        return this.validator(c);
    }

}

// Validate phone numbers

function validatePhoneNumber(): ValidatorFn {
    return (c: AbstractControl) => {
        let phoneNumberPattern = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
        let isValid = phoneNumberPattern.test(c.value);

        if (isValid) {
            return null;
        } else {
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
        const today = new Date();
        const birthDate = new Date(c.value);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        let isValid = age >= 18;
        
        if (isValid) {
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

}

//Validate zip code
function validateZip(): ValidatorFn {
    return (c: AbstractControl) => {
        let zipPattern = /^\d{5}(?:[-\s]\d{4})?$/;
        let isValid = zipPattern.test(c.value);

        if (isValid) {
            return null;
        } else {
            return {
                validateZip: {
                    valid: false
                }
            };
        }
    }
}

@Directive({
    selector: '[validateZip][ngModel]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: ZipCodeValidator, multi: true }
    ]
})

export class ZipCodeValidator implements Validator {
    validator: ValidatorFn;

    constructor() {
        this.validator = validateZip();
    }

    validate(c: FormControl) {
        return this.validator(c);
    }

}

// Validate ABA/Routing number
function validateABA(): ValidatorFn {
    return (c: AbstractControl) => {
        let userInput = String(c.value);

        let i, n, t, s;

        // First, remove any non-numeric characters.
        //s = userInput.replace(/\D/g, ''); ==>Alternative option to for loop
        //console.log(s);
        t = "";
        for (i = 0; i < userInput.length; i++) {
            s = parseInt(userInput.charAt(i), 10);
            if (s >= 0 && s <= 9)
                t = t + s;
        }

        // Check the length, it should be nine digits.

        if (t.length !== 9) {
            return {
                validateABA: {
                    valid: false
                }
            }
        }

        // Now run through each digit and calculate the total.
        n = 0;
        for (i = 0; i < t.length; i +=3) {
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


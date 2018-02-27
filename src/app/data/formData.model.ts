export class FormData {
    loanAmount: string = '';
    termPeriod: string = '';
    prefix: string = '';
    firstName: string = '';
    lastName: string = '';
    homePhone: string = '';
    workPhone: string = '';
    mobilePhone: string = '';
    email: string = '';
    dob: string = '';
    ssn: string = '';
    driversLicense: string = '';
    issuingState: string = '';
    militaryService: string = '';


    incomeSource: string = '';
    employerName: string = '';
    paymentType: string = '';
    employmentYears: string = '';
    employmentMonths: string = '';
    payFrequency: string = '';
    netAmount: string = '';
    jobTitle: string = '';

    street: string = '';
    city: string = '';
    state: string = '';
    zip: string = '';
    addressMonths: string = '';
    addressYears: string = '';
    residentialStatus: string = '';

    bankName: string = '';
    accountNumber: string = '';
    routingNumber: string = '';
    bankTimeYears: string = '';
    bankTimeMonths: string = '';
    accountType: string = '';

    clear() {
        this.loanAmount = '';
        this.termPeriod = '';
        this.prefix = '';
        this.firstName = '';
        this.lastName = '';
        this.homePhone = '';
        this.workPhone = '';
        this.mobilePhone = '';
        this.email = '';
        this.dob = '';
        this.ssn = '';
        this.driversLicense = '';
        this.issuingState = '';
        this.driversLicense = '';

        this.incomeSource = '';
        this.employerName = '';
        this.paymentType = '';
        this.employmentYears = '';
        this.employmentMonths = '';
        this.payFrequency = '';
        this.netAmount = '';
        this.jobTitle = '';

        this.street = '';
        this.city = '';
        this.state = '';
        this.zip = '';
        this.addressMonths = '';
        this.addressYears = '';
        this.residentialStatus = '';

        this.bankName = '';
        this.accountNumber = '';
        this.routingNumber = '';
        this.bankTimeYears = '';
        this.bankTimeMonths = '';
        this.accountType = '';
    }
}

export class Personal {
    loanAmount: string = '';
    termPeriod: string = '';
    prefix: string = '';
    firstName: string = '';
    lastName: string = '';
    homePhone: string = '';
    workPhone: string = '';
    mobilePhone: string = '';
    email: string = '';
    dob: string = '';
    ssn: string = '';
    driversLicense: string = '';
    issuingState: string = '';
    militaryService: string = '';
}

export class Income {
    incomeSource: string = '';
    employerName: string = '';
    paymentType: string = '';
    employmentYears: string = '';
    employmentMonths: string = '';
    payFrequency: string = '';
    netAmount: string = '';
    jobTitle: string = '';
}

export class Address {
    street: string = '';
    city: string = '';
    state: string = '';
    zip: string = '';
    addressMonths: string = '';
    addressYears: string = '';
    residentialStatus: string = '';
}

export class Bank {
    bankName: string = '';
    accountNumber: string = '';
    routingNumber: string = '';
    bankTimeYears: string = '';
    bankTimeMonths: string = '';
    accountType: string = '';
}
# Hire me to your projects

Ok, I know that sounds a little bit weird, but I think we can do good deals together!

This README file is just supposed to help you to understand me a little bit more, seeing some things I'm able to do!

What is supposed to show you here?

* Salesforce CLI knowledge;
    * Deployments and validations;
    * Metadata manipulation;
    * Data manipulation;
    * Permission assignment;
* Salesforce knowledge;
    * Lightning Data Service;
    * Lightning Design System;
    * Lightning Web Components;
* Bash script knowledge;



So, let's step by step get this project running...

## 01 - Scratch org creation

To make our lives easy, we can automate many things, putting the Salesforce CLI, and the bash scripts to run together!

    ./scripts/bash/1-createScratchOrg.sh tmpOrg

![Scratch Org Creation](images/01-ScratchOrgCreation.png)

## 02 - Custom fields and permissions

I'm using a custom Invoice object here.
To create the necessary things and have access on that, just execute the command below:

    sf project deploy start --ignore-conflicts --manifest manifest/package-1Objects.xml

After that, let's give the permission:

    sfdx force:user:permset:assign --perm-set-name InterviewChallenge --target-org tmpOrg

## 03 - Create initial data

At this point, we could just use the create record command:

    sf data create record --sobject Account --values "Name='Some Account Name' Website=www.example.com"

But just to show you a little bit about the data tree importation, let's do it in another way:

    sf data import tree --files scripts/json/Account-Contact.json 

## 04  - Coverage
All of it is very important, but in the end of the day, you will not be able apply on your productive environment, if the coverage is not enough!

Here you'll have this [Apex Test Suite](force-app/main/default/testSuites/TestAllTogether.testSuite-meta.xml) to easily get sure about that!

![Run All Together](images/RunAllTogether.png)

So, you can really check if the things are running as supposed to be:

    sf project deploy start --manifest manifest/package-1Objects.xml -l RunSpecifiedTests -t InvoiceBatchTest InvoiceControllerTest InvoiceScheduleTest

![Full Deployment](images/fullDeployment.png)

## 05 - Let the job running

Well, if everything was executed fine until here, you can schedule the job

    sf apex run --file scripts/apex/invoiceScheduler.apex

![Invoice Scheduler](images/InvoiceScheduler.png)
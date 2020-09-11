import { IApplication, BusinessSector, MaritalStatus, ResidentialStatus } from '../../src';

export const applicationSample: IApplication = {
  id: '5f590f42b10afde077e204c4',
  externalErrors: [],
  createdAt: new Date('2020-09-09T17:22:10.797+0000'),
  updatedAt: new Date('2020-09-09T17:29:28.477+0000'),
  applicant: {
    extraProperties: {},
    professionalSituation: {
      businessSector: BusinessSector.PUBLIC,
      spcCode: '38',
      label: 'John',
      seniorityDate: '2000/02',
      employerName: 'John',
      employerCity: 'LYON 01',
    },
    contact: {
      street: '151 Rue test',
      additionalInformation: '',
      zipCode: '75002',
      city: 'PARIS 02',
      country: 'FR',
      email: 'll@ll.fr',
      mobilePhoneNumber: '0606060606',
    },
  },
  maritalStatus: MaritalStatus.MARRIED,
  numberOfChildren: 0,
  coApplicant: {
    professionalSituation: {
      businessSector: BusinessSector.PUBLIC,
      spcCode: '37',
      label: 'Plombier',
      seniorityDate: '2000/02',
      employerName: 'La poste',
      employerCity: 'LYON 04',
    },
    extraProperties: {
      siclidSector: 'SPU',
      siclidBusinessSector: 'SPU',
      siclidCSPCode: 41,
      siclidContractType: 'I',
    },
  },
  residentialStatus: ResidentialStatus.OWNER,
  residentialSeniorityDate: '2000/02',
};

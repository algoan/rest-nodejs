import { Holder, IFolder } from '../../src';
import { legalDocumentSample } from './legal-document';

export const folderSample: IFolder = {
  id: '5f61d3bf3b9e4d2ad7b4b251',
  state: 0,
  createdAt: new Date('2020-09-16T08:58:39.471+0000'),
  legalDocuments: [legalDocumentSample],
  supportingDocuments: [],
  updatedAt: new Date('2020-09-16T08:58:39.479+0000'),
  expiredAt: new Date('2020-10-16T08:58:39.472+0000'),
  signatures: [
    {
      id: 'sign_id',
      partnerId: 'partner_id',
      legalDocumentIds: ['docId'],
      createdAt: new Date('2020-08-14T10:14:20.224+0000'),
      state: 0,
      holder: Holder.APPLICANT,
    },
  ],
};

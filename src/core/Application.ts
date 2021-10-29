import { RequestBuilder } from '../RequestBuilder';
import {
  IApplication,
  MaritalStatus,
  ProjectType,
  PaymentFrequency,
  ResidentialStatus,
  HousingType,
  OptIn,
  Applicant,
  ApplicationStatus,
  ExternalError,
  PatchApplicationDTO,
  PartnerData,
} from '../lib';

/**
 * Application instance
 * Cf: https://developers.algoan.com/api/#operation/getApplicationProgress
 */
export class Application implements IApplication {
  /**
   * Unique identifier
   */
  public id: string;
  /**
   * load Term
   */
  public loanTerm?: number;

  /**
   * Requested loan amount
   */
  public loanAmount?: number;
  /**
   * Amount to repay every period
   */
  public paymentAmount?: number;

  public paymentFrequency?: PaymentFrequency;
  /**
   * Nature of the user\'s project
   */
  public projectType?: ProjectType;
  /**
   * marital status of the applicant
   */
  public maritalStatus?: MaritalStatus;
  /**
   * Number of children of the applicant
   */
  public numberOfChildren?: number;

  /**
   * Number of other dependent of the applicant
   */
  public otherDependentNumber?: number;
  /**
   * Residential status of the applicant
   */
  public residentialStatus?: ResidentialStatus;
  /**
   * Housing type of the applicant
   */
  public housingType?: HousingType;
  /**
   * Residential seniority
   */
  public residentialSeniorityDate?: string;

  public optIn?: OptIn;
  /**
   * Specify if the applicant owns a secondary residence
   */
  public hasSecondaryResidence?: boolean;
  /**
   * Skip the aggregation process
   */
  public skipAggregation?: boolean;
  /**
   * Skip the GDPF connection process
   */
  public skipGDPF?: boolean;
  /**
   * The identifier of the application on the bank partner side
   */
  public partnerId?: string;
  /**
   * Link the loyalty account to the application
   */
  public loyaltyAccountLinked?: boolean;
  /**
   * The identifier of the product related to the application
   */
  public productId?: string;
  public applicant?: Applicant;
  public coApplicant?: Applicant;
  public userSelection?: {
    productId?: string;
    productPartnerId: string;
    pricingId?: string;
    pricingPartnerId?: string;
    debitType?: string;
  };
  /**
   * Application status
   */
  public status?: ApplicationStatus;
  /**
   * External errors
   */
  public externalErrors?: ExternalError[];
  /**
   * External errors
   */
  public partnerData?: PartnerData;
  /**
   * Timestamps
   */
  public createdAt: Date;
  public updatedAt: Date;

  constructor(params: IApplication, private readonly requestBuilder: RequestBuilder) {
    this.id = params.id;
    this.loanTerm = params.loanTerm;
    this.loanAmount = params.loanAmount;
    this.paymentAmount = params.paymentAmount;
    this.paymentFrequency = params.paymentFrequency;
    this.projectType = params.projectType;
    this.maritalStatus = params.maritalStatus;
    this.numberOfChildren = params.numberOfChildren;
    this.otherDependentNumber = params.otherDependentNumber;
    this.residentialStatus = params.residentialStatus;
    this.housingType = params.housingType;
    this.residentialSeniorityDate = params.residentialSeniorityDate;
    this.optIn = params.optIn;
    this.hasSecondaryResidence = params.hasSecondaryResidence;
    this.skipAggregation = params.skipAggregation;
    this.skipGDPF = params.skipGDPF;
    this.partnerId = params.partnerId;
    this.loyaltyAccountLinked = params.loyaltyAccountLinked;
    this.productId = params.productId;
    this.applicant = params.applicant;
    this.coApplicant = params.coApplicant;
    this.userSelection = params.userSelection;
    this.status = params.status;
    this.partnerData = params.partnerData;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
  }

  /**
   * Fetch a banksUser by ID
   *
   * @param id Id of the BanksUser to fetch
   * @param requestBuilder Service account request builder
   */
  public static async getApplicationById(id: string, requestBuilder: RequestBuilder): Promise<Application> {
    const application: IApplication = await requestBuilder.request({
      url: `/v1/applications/${id}`,
      method: 'GET',
    });

    return new Application(application, requestBuilder);
  }

  /**
   * Update an application
   * @param body Patch banks user request body
   */
  public async update(body: PatchApplicationDTO): Promise<void> {
    const application: IApplication = await this.requestBuilder.request({
      url: `/v1/applications/${this.id}`,
      method: 'PATCH',
      data: body,
    });

    this.id = application.id;
    this.loanTerm = application.loanTerm;
    this.loanAmount = application.loanAmount;
    this.paymentAmount = application.paymentAmount;
    this.paymentFrequency = application.paymentFrequency;
    this.projectType = application.projectType;
    this.maritalStatus = application.maritalStatus;
    this.numberOfChildren = application.numberOfChildren;
    this.otherDependentNumber = application.otherDependentNumber;
    this.residentialStatus = application.residentialStatus;
    this.housingType = application.housingType;
    this.residentialSeniorityDate = application.residentialSeniorityDate;
    this.optIn = application.optIn;
    this.hasSecondaryResidence = application.hasSecondaryResidence;
    this.skipAggregation = application.skipAggregation;
    this.skipGDPF = application.skipGDPF;
    this.partnerId = application.partnerId;
    this.loyaltyAccountLinked = application.loyaltyAccountLinked;
    this.productId = application.productId;
    this.applicant = application.applicant;
    this.coApplicant = application.coApplicant;
    this.userSelection = application.userSelection;
    this.status = application.status;
    this.externalErrors = application.externalErrors;
    this.partnerData = application.partnerData;
  }
}

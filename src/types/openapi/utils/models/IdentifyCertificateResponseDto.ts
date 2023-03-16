// tslint:disable
/**
 * CZERTAINLY Utils Service API
 * REST APIs for utility and helper function to work with certificates
 *
 * The version of the OpenAPI document: 1.0.0-SNAPSHOT
 * Contact: getinfo@czertainly.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

/**
 * @export
 * @interface IdentifyCertificateResponseDto
 */
export interface IdentifyCertificateResponseDto {
    /**
     * Identified Type of certificate
     * @type {string}
     * @memberof IdentifyCertificateResponseDto
     */
    certificateType: IdentifyCertificateResponseDtoCertificateTypeEnum;
}

/**
 * @export
 * @enum {string}
 */
export enum IdentifyCertificateResponseDtoCertificateTypeEnum {
    X509 = 'X509',
    Ssh = 'SSH'
}

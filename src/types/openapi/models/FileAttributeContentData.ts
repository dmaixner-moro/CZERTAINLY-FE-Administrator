// tslint:disable
/**
 * CZERTAINLY Core API
 * REST API for CZERTAINLY Core
 *
 * The version of the OpenAPI document: 2.8.2-SNAPSHOT
 * Contact: getinfo@czertainly.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

/**
 * File attribute content data
 * @export
 * @interface FileAttributeContentData
 */
export interface FileAttributeContentData {
    /**
     * File content
     * @type {string}
     * @memberof FileAttributeContentData
     */
    content: string;
    /**
     * Name of the file
     * @type {string}
     * @memberof FileAttributeContentData
     */
    fileName: string;
    /**
     * Type of the file uploaded
     * @type {string}
     * @memberof FileAttributeContentData
     */
    mimeType: string;
}

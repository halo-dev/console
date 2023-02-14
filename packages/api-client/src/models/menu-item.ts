/* tslint:disable */
/* eslint-disable */
/**
 * Halo Next API
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 2.0.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

// May contain unused imports in some cases
// @ts-ignore
import { MenuItemSpec } from './menu-item-spec'
// May contain unused imports in some cases
// @ts-ignore
import { MenuItemStatus } from './menu-item-status'
// May contain unused imports in some cases
// @ts-ignore
import { Metadata } from './metadata'

/**
 *
 * @export
 * @interface MenuItem
 */
export interface MenuItem {
  /**
   *
   * @type {MenuItemSpec}
   * @memberof MenuItem
   */
  spec: MenuItemSpec
  /**
   *
   * @type {MenuItemStatus}
   * @memberof MenuItem
   */
  status?: MenuItemStatus
  /**
   *
   * @type {string}
   * @memberof MenuItem
   */
  apiVersion: string
  /**
   *
   * @type {string}
   * @memberof MenuItem
   */
  kind: string
  /**
   *
   * @type {Metadata}
   * @memberof MenuItem
   */
  metadata: Metadata
}

/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for
 * license information.
 * 
 * Code generated by Microsoft (R) AutoRest Code Generator 0.16.0.0
 * Changes may cause incorrect behavior and will be lost if the code is
 * regenerated.
 */

'use strict';

/**
 * @class
 * Initializes a new instance of the ExpressRouteServiceProviderBandwidthsOffered class.
 * @constructor
 * Contains Bandwidths offered in ExpressRouteServiceProviders
 * @member {string} [offerName] Gets the OfferName
 * 
 * @member {number} [valueInMbps] Gets the ValueInMbps.
 * 
 */
function ExpressRouteServiceProviderBandwidthsOffered() {
}

/**
 * Defines the metadata of ExpressRouteServiceProviderBandwidthsOffered
 *
 * @returns {object} metadata of ExpressRouteServiceProviderBandwidthsOffered
 *
 */
ExpressRouteServiceProviderBandwidthsOffered.prototype.mapper = function () {
  return {
    required: false,
    serializedName: 'ExpressRouteServiceProviderBandwidthsOffered',
    type: {
      name: 'Composite',
      className: 'ExpressRouteServiceProviderBandwidthsOffered',
      modelProperties: {
        offerName: {
          required: false,
          serializedName: 'offerName',
          type: {
            name: 'String'
          }
        },
        valueInMbps: {
          required: false,
          serializedName: 'valueInMbps',
          type: {
            name: 'Number'
          }
        }
      }
    }
  };
};

module.exports = ExpressRouteServiceProviderBandwidthsOffered;

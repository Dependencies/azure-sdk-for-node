/**
* Copyright (c) Microsoft.  All rights reserved.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

var mocha = require('mocha');
var should = require('should');
var _ = require('underscore');
var HDInsightTestUtils = require('./hdinsight-test-utils.js')

// Test includes
var testutil = require('../../util/util');

var PerformRequestStubUtil = require('./PerformRequestStubUtil.js');

var azure = testutil.libRequire('azure');
var performRequestStubUtil;

describe('HDInsight listClusters (under unit test)', function() {
  var subscriptionId = process.env['AZURE_SUBSCRIPTION_ID'];
  var auth = { keyvalue: testutil.getCertificateKey(), certvalue: testutil.getCertificate() };
  var HDInsight = require('../../../lib/services/serviceManagement/hdinsightservice.js');
  var hdInsight = azure.createHDInsightService(subscriptionId, auth);
  var hdinsightTestUtils = new HDInsightTestUtils();
  var creds;

  beforeEach(function (done) {
    performRequestStubUtil.NoStubProcessRequest();
    done();
  });

  afterEach(function (done) {
    performRequestStubUtil.NoStubProcessRequest();
    done();
  });

  after(function (done) {
    performRequestStubUtil.Revert();
    done();
  });

  // NOTE: To Do, we should actually create new acounts for our tests
  //       So that we can work on any existing subscription.
  before (function (done) {
    performRequestStubUtil = new PerformRequestStubUtil(HDInsight);
    hdinsightTestUtils.getTestCredentialData(function (result) {
      should.exist(result);
      creds = result;
      done();
    });
  });

  var goodResult = {
    CloudServices: {
      CloudService: [
        { Name: 'not-hdinsight' } ,
        {
          Name: 'hdinsightHRIEVKWCABCRT3AK64SGDGFJDR7EM64QV4T5UXU23MU6ZPCWG5NQ-East-US-2',
          GeoRegion: 'East US 2',
          Resources: {
            Resource: [
              {
                ResourceProviderNamespace: 'hdinsight',
                Type: 'containers',
                Name: 'tsthdx00hdxcibld02',
                State: 'Started',
                SubState: 'Running'
              },
              {
                ResourceProviderNamespace: 'not-hdinsight'
              }
            ]
          }
        }
      ]
    }
  };

  var singleResult = {
    CloudServices: {
      CloudService: {
        Name: 'hdinsightHRIEVKWCABCRT3AK64SGDGFJDR7EM64QV4T5UXU23MU6ZPCWG5NQ-East-US-2',
        GeoRegion: 'East US 2',
        Resources: {
          Resource: {
            ResourceProviderNamespace: 'hdinsight',
            Type: 'containers',
            Name: 'tsthdx00hdxcibld02',
            State: 'Started',
            SubState: 'Running'
          }
        }
      }
    }
  };

  it('should pass the error to the callback function', function(done) {
    performRequestStubUtil.StubAuthenticationFailed('http://test.com');
    hdInsight.listClusters(function (err, response) {
      should.exist(err);
      response.statusCode.should.be.eql(403);
      done();
    });
  });

  it('should turn single cloudservice items and resource items into arrays', function(done) {
    performRequestStubUtil.StubProcessRequestWithSuccess('http://test.com', singleResult);
    hdInsight.listClusters(function (err, response) {
      should.not.exist(err);
      should.exist(response.body.CloudServices.CloudService);
      _.isArray(response.body.CloudServices.CloudService).should.be.eql(true);
      response.body.CloudServices.CloudService.length.should.be.eql(1);
      should.exist(response.body.CloudServices.CloudService[0].Resources.Resource);
      _.isArray(response.body.CloudServices.CloudService).should.be.eql(true);
      response.body.CloudServices.CloudService.length.should.be.eql(1);
      done(err);
    });
  });

  it('should provide the right headers for the request', function(done) {
    performRequestStubUtil.StubProcessRequestWithSuccess('http://test.com', goodResult);
    hdInsight.listClusters(function (err) {
      var webResource = performRequestStubUtil.GetLastWebResource();
      should.exist(webResource);
      webResource.path.should.be.eql('/' + subscriptionId + '/cloudservices');
      webResource.httpVerb.should.be.eql('GET');
      _.size(webResource.headers).should.be.eql(2);
      webResource.headers['x-ms-version'].should.be.eql('2011-08-18');
      webResource.headers['accept'].should.be.eql('application/xml');
      done(err);
    });
  });

  it('should remove CloudServices not related to HDInsight', function (done) {
    performRequestStubUtil.StubProcessRequestWithSuccess('http://test.com', goodResult);
    hdInsight.listClusters(function (err, response) {
      should.not.exist(err);
      should.exist(response.body.CloudServices.CloudService);
      response.body.CloudServices.CloudService.length.should.eql(1);
      response.body.CloudServices.CloudService[0].Name.should.eql('hdinsightHRIEVKWCABCRT3AK64SGDGFJDR7EM64QV4T5UXU23MU6ZPCWG5NQ-East-US-2');
      done(err);
    });
  });

  it('should remove resources not representing a cluster', function (done) {
    performRequestStubUtil.StubProcessRequestWithSuccess('http://test.com', goodResult);
    hdInsight.listClusters(function (err, response) {
      should.not.exist(err);
      should.exist(response.body.CloudServices.CloudService);
      response.body.CloudServices.CloudService[0].Resources.Resource.length.should.eql(1);
      response.body.CloudServices.CloudService[0].Resources.Resource[0].Name.should.eql('tsthdx00hdxcibld02');
      done(err);
    });
  });

});

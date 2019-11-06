'use strict';

var vastUtil = require('./vastUtil');
var Creative = require('./Creative');
var Category = require('./Category');
var ViewableImpression = require('./ViewableImpression');
var Verification = require('./Verification');

var utilities = require('../../utils/utilityFunctions');
var xml = require('../../utils/xml');

function InLine (inlineJTree) {
  if (!(this instanceof InLine)) {
    return new InLine(inlineJTree);
  }

  // Required Fields
  this.adTitle = xml.keyValue(inlineJTree.adTitle);
  this.adSystem = xml.keyValue(inlineJTree.adSystem);
  this.impressions = vastUtil.parseImpressions(inlineJTree.impression);
  this.creatives = Creative.parseCreatives(inlineJTree.creatives);

  // Optional Fields
  this.description = xml.keyValue(inlineJTree.description);
  this.advertiser = xml.keyValue(inlineJTree.advertiser);
  this.surveys = parseSurveys(inlineJTree.survey);
  // this.error = xml.keyValue(inlineJTree.error);
  this.errors = vastUtil.parseErrors(inlineJTree.error);
  this.pricing = xml.keyValue(inlineJTree.pricing);
  this.extensions = inlineJTree.extensions;
  if (window.mol_vastVersion === 4) {
	  if (inlineJTree.category) {
		  this.categories = Category.parseCategories(inlineJTree.category);
	  }
	  if (inlineJTree.viewableImpression) {
		  this.viewableImpression = new ViewableImpression(inlineJTree.viewableImpression);
	  }
	  if (inlineJTree.adVerifications) {
		  this.adVerifications = Verification.parseAdVerifications(inlineJTree.adVerifications);
	  }
  }

  // **** Local Functions **** //
  function parseSurveys (inlineSurveys) {
    if (inlineSurveys) {
      return utilities.transformArray(utilities.isArray(inlineSurveys) ? inlineSurveys : [inlineSurveys], function (survey) {
        if (utilities.isNotEmptyString(survey.keyValue)) {
          return {
            uri: survey.keyValue,
            type: survey.attr('type')
          };
        }

        return undefined;
      });
    }
    return [];
  }

}


/**
 * Returns true if the browser supports all the creatives.
 */
InLine.prototype.isSupported = function () {
  var i, len;

  if (this.creatives.length === 0) {
    return false;
  }

  for (i = 0, len = this.creatives.length; i < len; i += 1) {
    if (!this.creatives[i].isSupported()) {
      return false;
    }
  }
  return true;
};

module.exports = InLine;

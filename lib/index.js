'use strict'
var through = require('through2');
var gilpUtil = require('gilp-util');


var BranchValidator = function(opts) {
  this.allow = this.prepareExpressions(opts.allow);
  this.disallow = this.prepareExpressions(opts.disallow);
};

BranchValidator.prototype.prepareExpressions = function(expressions) {
  expressions = !expressions ? [] : expressions;
  if (expressions instanceof RegExp || typeof expressions === 'string') {
    expressions = [expressions];
  }
  return expressions
};

BranchValidator.prototype.isAllowed = function(branchName) {
  if (!this.allow.length) {
    return true;
  }
  return this.allow.filter(String.prototype.match.bind(branchName)).length > 0;
};

BranchValidator.prototype.isDisAllowed = function(branchName) {
  if (!this.disallow.length) {
    return false;
  }
  return this.disallow.filter(String.prototype.match.bind(branchName)).length > 0;
};

BranchValidator.prototype.validate = function(branchName) {
  return this.isAllowed(branchName) && !this.isDisAllowed(branchName);
};

var gilpCheckBranchName = function (expr, message) {
  message = message || 'Invalid branch name.';

  function bufferContents(file, enc, cb) {
    cb();
  }

  function endStream(cb) {
    var branchName = gilpUtil.getBranchName();
    if (!(new BranchValidator(opts).validate(branchName))) {
      this.emit('error', new Error('gilp-check-branch-name: ' + message));
      cb();
    }
  }

  return through.obj(bufferContents, endStream);
};

module.exports = gilpCheckBranchName;

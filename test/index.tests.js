'use strict';

var assert = require('assert');
var rewire = require('rewire');
var BranchValidator = rewire('../lib').__get__('BranchValidator');

require('mocha');

describe('BranchValidator', function() {
  describe('#isAllowed', function() {
    it('should approve string matching string expression', function() {
      var opts = {
        allow: 'hotfix',
      };
      assert(new BranchValidator(opts).validate('hotfix'));
    });

    it('should approve string matching RegExp', function() {
      var opts = {
        allow: /dev-[0-9]{4}/,
      };
      assert(new BranchValidator(opts).validate('dev-1312'));
    });

    it('should approve string matching RegExp and/or String array', function() {
      var opts = {
        allow: [/dev-[0-9]{4}/, 'hotfix'],
      };
      var validator = new BranchValidator(opts);
      assert(validator.validate('dev-1312'))
      assert(validator.validate('hotfix'))
    });

    it('should not approve string not matching string expression', function() {
      var opts = {
        allow: 'dev',
      };
      assert.equal(false, new BranchValidator(opts).validate('master'));
    });

    it('should not approve string not matching RegExp', function() {
      var opts = {
        allow: /dev-[0-9]{4}/,
      };
      assert.equal(false, new BranchValidator(opts).validate('master'));
    });

    it('should not approve string not matching RegExp and/or String array', function() {
      var opts = {
        allow: [/dev-[0-9]{4}/, 'dev'],
      };
      var validator = new BranchValidator(opts);
      assert.equal(false, validator.validate('master'));
    });
  });

  describe('#isDisAllowed', function() {
    it('should not approve string matching string expression', function() {
      var opts = {
        disallow: 'hotfix',
      };
      assert.equal(false, new BranchValidator(opts).validate('hotfix'));
    });

    it('should not approve string matching RegExp', function() {
      var opts = {
        disallow: /dev-[0-9]{4}/,
      };
      assert.equal(false, new BranchValidator(opts).validate('dev-1312'));
    });

    it('should not approve string matching RegExp and/or String array', function() {
      var opts = {
        disallow: [/dev-[0-9]{4}/, 'hotfix'],
      };
      var validator = new BranchValidator(opts);
      assert.equal(false, validator.validate('dev-1312'))
      assert.equal(false, validator.validate('hotfix'))
    });

    it('should approve string not matching string expression', function() {
      var opts = {
        disallow: 'dev',
      };
      assert(new BranchValidator(opts).validate('master'));
    });

    it('should approve string not matching RegExp', function() {
      var opts = {
        disallow: /dev-[0-9]{4}/,
      };
      assert(new BranchValidator(opts).validate('master'));
    });

    it('should approve string not matching RegExp and/or String array', function() {
      var opts = {
        disallow: [/dev-[0-9]{4}/, 'dev'],
      };
      var validator = new BranchValidator(opts);
      assert(validator.validate('master'));
    });
  });

});


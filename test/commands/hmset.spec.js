var assert = require("assert");
var config = require("../lib/config");
var helper = require("../helper");
var redis = config.redis;

describe("The 'hmset' method", function () {

    helper.allTests(function(parser, ip, args) {

        describe("using " + parser + " and " + ip, function () {
            var client;
            var hash = 'test hash';

            beforeEach(function (done) {
                client = redis.createClient.apply(redis.createClient, args);
                client.once("error", done);
                client.once("connect", function () {
                    client.flushdb(done);
                });
            });

            it('handles redis-style syntax', function (done) {
                client.HMSET(hash, "0123456789", "abcdefghij", "some manner of key", "a type of value", helper.isString('OK'));
                client.HGETALL(hash, function (err, obj) {
                    assert.equal(obj['0123456789'], 'abcdefghij');
                    assert.equal(obj['some manner of key'], 'a type of value');
                    return done(err);
                })
            });

            it('handles object-style syntax', function (done) {
                client.HMSET(hash, {"0123456789": "abcdefghij", "some manner of key": "a type of value"}, helper.isString('OK'));
                client.HGETALL(hash, function (err, obj) {
                    assert.equal(obj['0123456789'], 'abcdefghij');
                    assert.equal(obj['some manner of key'], 'a type of value');
                    return done(err);
                })
            });

            it('allows a numeric key', function (done) {
                client.HMSET(hash, 99, 'banana', helper.isString('OK'));
                client.HGETALL(hash, function (err, obj) {
                    assert.equal(obj['99'], 'banana');
                    return done(err);
                });
            });

            afterEach(function () {
                client.end();
            });
        });
    });
});
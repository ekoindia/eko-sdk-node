const { expect, assert } = require('chai');

var ekoApi = require('../index');

describe('index.js', function() {
    describe('#verifyPAN(options, cb)', function() {
      var validOptions = { 
                panNumber: "VBLPZ6447L", 
                purpose: 1, 
                purposeDescription: "onboarding" 
            }
      it('verifyPAN('+JSON.stringify(validOptions)+', cb) should return valid data to the callback', function(done) {
        ekoApi.verifyPAN(validOptions, function(err, data){ 
            try{
                expect(data).to.be.an('Object', 'Returned data is not an object')
                assert.isNotNull(data)
                expect(data).to.include.all.keys("pan_number", "title", "first_name", "middle_name", "last_name");
                done()
            } catch(error){
                done(error)
            }
        })
      });
    })

    describe('#verifyBankAccount(options, cb)', function() {
        var validOptions = { 
                accountNo: '1711654121', 
                ifsc: "KKBK0000261", 
                customerId: "7661109875", 
                userCode:"20810200"
            }
        it('verifyBankAccount('+JSON.stringify(validOptions)+', cb) should return valid data to the callback', function(done) {
          ekoApi.verifyPAN(validOptions, function(err, data){ 
              try{
                  expect(data).to.be.an('Object', 'Returned data is not an object')
                  assert.isNotNull(data)
                  expect(data).to.include.all.keys("amount", "fee","verification_failure_refund", "is_Ifsc_required", "tid", "client_ref_id", "bank", "is_name_editable", "user_code", "aadhar", "recipient_name", "ifsc", "account");
                  done()
              } catch(error){
                  done(error)
              }
          })
        });
      })
})
const { expect, assert } = require('chai');

var ekoApi;

describe('index.js', function() {
    describe('#init()', function(){
        it('initializes SDK without error', function(done){
            try{
                ekoApi = require('../index').init();
                done();
                // setTimeout(() => {
                //     done();
                // }, 3000)
            } catch(err){
                done(err)
            }
        })
    })

    describe('#isPANServiceActive(cb)', function() {
        it('isPANServiceActive(cb) should return valid data to the callback', function(done) {
          ekoApi.isPANServiceActive(function(err, isActive){ 
              try{
                  expect(isActive).to.be.an('boolean', 'Returned data is not a boolean')
                  done()
              } catch(error){
                  done(error)
              }
          })
        });
      })

    describe('#verifyPAN(options, cb)', function() {
      let validOptions = { 
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
        let validOptions = { 
                accountNo: '1711654121', 
                ifsc: "KKBK0000261", 
                userCode:"20810200",
                customerId: "9999912348",
                initiatorId: "9910028267"
            }
        it('verifyBankAccount('+JSON.stringify(validOptions)+', cb) should return valid data to the callback', function(done) {
          ekoApi.verifyBankAccount(validOptions, function(err, data){ 
              try{
                  expect(data).to.be.an('Object', 'Returned data is not an object')
                  assert.isNotNull(data)
                  expect(data).to.include.all.keys("amount", "fee","verification_failure_refund", "is_Ifsc_required", "tid", "client_ref_id", "bank", "is_name_editable", "user_code", "aadhar", "recipient_name", "account");
                  done()
              } catch(error){
                  done(error)
              }
          })
        });
      })
})
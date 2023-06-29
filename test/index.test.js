const { expect, assert } = require('chai');

var ekoApi;

describe('index.js', function() {
    describe('#init()', function(){
        it('initializes SDK without error', function(done){
            try{
                ekoApi = require('../index').init({ allowInsecureRequest: true });
                done();
                // setTimeout(() => {
                //     done();
                // }, 3000)
            } catch(err){
                done(err)
            }
        })
    })

    /** KYC APIs --START-- */

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
                customerId: "6111111111",
                initiatorId: "9962981729"
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

    /** KYC APIs --END-- */

    /** Bill Payments APIs --START-- */

    describe.skip('#billPayments.getOperators', function() {
        let validOptions = { }
        it('billPayments.getOperators('+JSON.stringify(validOptions)+', cb) should return valid data to the callback', function(done) {
            ekoApi.billPayments.getOperators(validOptions, function(err, data){ 
                try{
                    expect(data).to.be.an('Array', 'Returned data is not an array')
                    assert.isNotNull(data)
                    data.forEach(element => {
                        expect(element).to.include.all.keys("operator_id", "name", "billFetchResponse", "high_commission_channel", "kyc_required", "operator_category", "location_id"); 
                    });
                    done()
                } catch(error){
                    done(error)
                }
            })
        });
    })

    describe('#billPayments.getOperatorCategories', function() {
        let validOptions = { }
        it('billPayments.getOperatorCategories('+JSON.stringify(validOptions)+', cb) should return valid data to the callback', function(done) {
            ekoApi.billPayments.getOperatorCategories(validOptions, function(err, data){ 
                try{
                    expect(data).to.be.an('Array', 'Returned data is not an array')
                    assert.isNotNull(data)
                    data.forEach(element => {
                        expect(element).to.include.all.keys("operator_category_name", "operator_category_id", "operator_category_group", "status"); 
                    });
                    done()
                } catch(error){
                    done(error)
                }
            })
        });
    })

    describe('#billPayments.getOperatorLocations', function() {
        let validOptions = { }
        it('billPayments.getOperatorLocations('+JSON.stringify(validOptions)+', cb) should return valid data to the callback', function(done) {
            ekoApi.billPayments.getOperatorLocations(validOptions, function(err, data){ 
                try{
                    expect(data).to.be.an('Array', 'Returned data is not an array')
                    assert.isNotNull(data)
                    data.forEach(element => {
                        expect(element).to.include.all.keys("operator_location_name", "operator_location_id", "abbreviation");
                    });
                    done()
                } catch(error){
                    done(error)
                }
            })
        });
    })

    describe('#billPayments.getOperatorParameters', function() {
        let validOptions = { operator: 1 }
        it('billPayments.getOperatorParameters('+JSON.stringify(validOptions)+', cb) should return valid data to the callback', function(done) {
            ekoApi.billPayments.getOperatorParameters(validOptions, function(err, data){ 
                try{
                    expect(data).to.be.an('Array', 'Returned data is not an array')
                    assert.isNotNull(data)
                    data.forEach(element => {
                        expect(element).to.include.all.keys("error_message", "param_label","regex", "param_name", "param_id", "param_type");
                    })
                    done()
                } catch(error){
                    done(error)
                }
            })
        });
    })

    describe('#billPayments.getBill', function() {
        let validOptions = { 
            initiatorId: 9962981729,
            "operator_id":"51",
            "user_code":"20810200",
            "client_ref_id":"202105311125123456",
            "utility_acc_no":"151627591",
            "confirmation_mobile_no":"9999999999",
            "sender_name":"Kaushik",
            "source_ip":"121.121.1.1",
            "latlong":"77.06794760,77.06794760",
            "hc_channel" : 1 
         }
        it('billPayments.getBill('+JSON.stringify(validOptions)+', cb) should return valid data to the callback', function(done) {
            ekoApi.billPayments.getBill(validOptions, function(err, data){ 
                try{
                    expect(data).to.be.an('Object', 'Returned data is not an object')
                    assert.isNotNull(data)
                    expect(data).to.include.all.keys("operator_id", "name", "billFetchResponse", "high_commission_channel", "kyc_required", "operator_category", "location_id");
                    done()
                } catch(error){
                    done(error)
                }
            })
        });
    })

    describe('#billPayments.payBill', function() {
        let validOptions = { 
            initiatorId: 9962981729,
            "source_ip":"121.121.1.1",
            "user_code":"20810200",
            "amount":"50" ,
            "client_ref_id":"202105311125123456",
            "utility_acc_no":"151627591",
            "confirmation_mobile_no":"9999999999",
            "sender_name":"Kaushik",
            "operator_id":"1",
            "latlong":"77.06794760,77.06794760",
            "hc_channel" : 1 
         }
        it('billPayments.payBill('+JSON.stringify(validOptions)+', cb) should return valid data to the callback', function(done) {
            ekoApi.billPayments.payBill(validOptions, function(err, data){ 
                try{
                    expect(data).to.be.an('Object', 'Returned data is not an object')
                    assert.isNotNull(data)
                    assert.isArray(data)
                    expect(data).to.include.all.keys("tx_status", "tds", "bbpstrxnrefid", "txstatus_desc", "utilitycustomername", "fee", "discount", "tid", "sender_id", "balance", "customerconveniencefee", "commission", "state", "recipient_id", "timestamp", "amount", "mobile", "reference_tid", "serial_number", "customermobilenumber", "payment_mode_desc", "last_used_okekey", "operator_name", "totalamount", "billnumber", "billdate", "status_text", "account")
                    done()
                } catch(error){
                    done(error)
                }
            })
        });
    })

    /** Bill Payments APIs --END-- */

}) 
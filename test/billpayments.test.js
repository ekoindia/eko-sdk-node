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
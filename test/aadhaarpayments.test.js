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

    describe('#aadhaar.pay', function() {
        let validOptions = { 
            "service_type": 2,
            "initiator_id": "9962981729",
            "user_code": "20810200",
            "customer_id": "9999999999",
            "bank_code": "HDFC",
            "amount": "100",
            "client_ref_id": "202105311125123456",
            "pipe": "0",
            "aadhar": "YrvFh+QFLmHXPjUWOXsDmFff0mRuAcCgazutSpBglgWuinHQMYzcBcO5tJ30vvxvyIXMb6d05l8j70cMpu7+96pG8n3Yla0/mVKQs4kIwqiFdJBAyox3oreZAhb6qilxjg7Apy6jSH6BMZwXUiRpFDaIZMb+cHXhCabeTzP1/fU=",
            "notify_customer": "0",
            "piddata": "<?xml version=\"1.0\"?><PidData>\n  <Resp errCode=\"0\" errInfo=\"Success\"...</PidData>"
         }
        it('aadhaarPayments.pay('+JSON.stringify(validOptions)+', cb) should return valid data to the callback', function(done) {
            ekoApi.aadhaar.pay(validOptions, function(err, data){ 
                try{
                    expect(data).to.be.an('Object', 'Returned data is not an object')
                    assert.isNotNull(data)
                    expect(data).to.include.all.keys("tx_status", "transaction_date", "reason", "amount", "merchant_code", "shop", "fee", "sender_name", "tid", "auth_code", "shop_address_line1", "user_code", "service_tax", "totalfee", "merchantname", "stan", "aadhar", "customer_balance", "transaction_time", "comment", "bank_ref_num", "terminal_id")
                    done()
                } catch(error){
                    done(error)
                }
            })
        });
    })

}) 
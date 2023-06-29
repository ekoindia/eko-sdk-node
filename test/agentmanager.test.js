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

    describe('#agent.onboard', function() {
        let validOptions = { 
            initiatorId: 9962981729,
            panNumber: "BFUPM3499K",
            mobile: 9123354235,
            firstName: "Tina",
            lastName: "Chawla",
            email: "a@gmail.com",
            address: {
                "line": "Eko India",
                "city": "Gurgaon",
                "state": "Haryana",
                "pincode": "122002",
                "district": "Banswara",
                "area": "Mongol"
            },
            dob: "1992-05-10",
            shopName: "Akanksha Stores"
         }
        it('agentManager.onboardAgent('+JSON.stringify(validOptions)+', cb) should return valid data to the callback', function(done) {
            ekoApi.agent.onboard(validOptions, function(err, data){ 
                try{
                    expect(data).to.be.an('Object', 'Returned data is not an object')
                    assert.isNotNull(data)
                    expect(data).to.include.all.keys("user_code", "initiator_id")
                    done()
                } catch(error){
                    done(error)
                }
            })
        });
    })

}) 
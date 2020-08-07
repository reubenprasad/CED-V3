const ProductTracker = artifacts.require('./ProductTracker.sol')

contract('ProductTracker', ([manufacturer, buyer, buyer2]) =>{      //Set up 3 accounts in the array for testing
    let producttracker

    before(async() => {
        producttracker = await ProductTracker.deployed()            //Retrieve the deployed contract
    })

    describe('deployment', async() =>{
        it('deploys successfully',async() =>{                   //Test to check whether contract is deployed properly and has a valid address
            const address =  await producttracker.address
            assert.notEqual(address, 0x0)
            assert.notEqual(address, '')
            assert.notEqual(address, null)
            assert.notEqual(address, undefined)
        })

    it('has valid manufacturer address', async() =>{                        //Test to check whether manufacturer address is set correctly
        const mfr_address = await producttracker.product_manufacturer()
        assert.notEqual(mfr_address, 0x0)
        assert.notEqual(mfr_address, '')
        assert.notEqual(mfr_address, null)
        assert.notEqual(mfr_address, undefined)
    })
    
    })

    describe('products',async() =>{         //Tests to check if products are added correctly and product count is incremented 
        let result, productCount
        before(async() =>{
            result = await producttracker.addProduct('Samsung TV',0,2,web3.utils.toWei('1','Ether'),{from: manufacturer})   
            productCount = await producttracker.productCount()
        })

        it('adds products', async() =>{     //Tests to check if products are added correctly and details are correct
            assert.equal(productCount,1)    //Product count is 1 because 1 product has been added
            const event = result.logs[0].args
            //TV is added with price 1 Ether, manufacturer is the owner
            assert.equal(event.name, 'Samsung TV','name is correct') 
            assert.equal(event.price,'1000000000000000000','price is correct')
            assert.equal(event.ownerAddress,manufacturer,'owner is correct')
        })

        it('retrieves products', async() =>{    //Test to check if products are listed correctly
            const product = await producttracker.product(productCount)
            assert.equal(product.name, 'Samsung TV','name is correct') 
            assert.equal(product.price,'1000000000000000000','price is correct')
            assert.equal(product.ownerAddress,manufacturer,'owner is correct')
        })

        it('buys products', async() =>{        //Test to check the product purchase functionality
            //Track manufacturer balance before purchase
            let oldSellerBalance
            oldSellerBalance = await web3.eth.getBalance(manufacturer)
            oldSellerBalance = new web3.utils.BN(oldSellerBalance)
            
            //'buyer' buys product from 'manufacturer' by sending 1 ether , productcount is 1 ; which is the product id passed to the buyProduct function
            result = await producttracker.buyProduct(productCount,{from: buyer,value: web3.utils.toWei('1','Ether')})
            const event = result.logs[0].args
            assert.equal(event.name, 'Samsung TV','name is correct') 
            assert.equal(event.price,'1000000000000000000','price is correct')
            assert.equal(event.used,false,'used is correct')            //Default value set to false for 'used'
            assert.equal(event.ownerAddress,buyer,'owner is correct')  //Check if owner is updated correctly

            //Check that the manufacturer received funds, by comparing balance before and after the transaction
            let newSellerBalance
            newSellerBalance = await web3.eth.getBalance(manufacturer)
            newSellerBalance = new web3.utils.BN(newSellerBalance)
 
            let price
            price = web3.utils.toWei('1','Ether')
            price = new web3.utils.BN(price)

           const expectedBalance = oldSellerBalance.add(price)
           assert.equal(newSellerBalance.toString(),expectedBalance.toString())

        })

        it('sells products',async() =>{         //Test to check if sellProduct() function works correctly
            //Call the sellProduct() from 'buyer' address and list product id 1 (Samsung tv) for sale at 2 Eth and set 'used' to true
            result = await producttracker.sellProduct(1,2,{from: buyer})
            const event = result.logs[0].args
            assert.equal(event.id, 1,'id is correct')
            assert.equal(event.price,2,'price is correct')
            assert.equal(event.used,true,'used is correct')
        })

        it('buys used products', async() =>{        //Test to check the used product purchase functionality 'buyUsedProduct()'
            //Track seller balance before purchase
            let oldSellerBalance
            oldSellerBalance = await web3.eth.getBalance(buyer)
            oldSellerBalance = new web3.utils.BN(oldSellerBalance)

            //Buy the used Samsung TV (listed for sale by 'buyer')for 2 eth from 'buyer2' account and check if values are correct
            result = await producttracker.buyUsedProduct(productCount,{from: buyer2,value: web3.utils.toWei('2','Ether')})
            const event = result.logs[0].args
            assert.equal(event.price,'2','price is correct')
            assert.equal(event.used,false,'used is correct')
            assert.equal(event.buyer,buyer2,'owner is correct')  //Check if owner is updated correctly

            //Check that the seller (who is 'buyer') received funds
            let newSellerBalance
            newSellerBalance = await web3.eth.getBalance(buyer)
            newSellerBalance = new web3.utils.BN(newSellerBalance)
 
            let price
            price = web3.utils.toWei('2','Ether')
            price = new web3.utils.BN(price)

           const expectedBalance = oldSellerBalance.add(price)
           assert.equal(newSellerBalance.toString(),expectedBalance.toString())

        })

    })
})
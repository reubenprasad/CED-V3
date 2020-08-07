const ProductTracker = artifacts.require('./ProductTracker.sol')

contract('ProductTracker', ([manufacturer, buyer]) =>{
    let producttracker

    before(async() => {
        producttracker = await ProductTracker.deployed()
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
            assert.equal(productCount,1)
            const event = result.logs[0].args
            assert.equal(event.name, 'Samsung TV','name is correct') 
            assert.equal(event.price,'1000000000000000000','price is correct')
            assert.equal(event.ownerAddress,manufacturer,'owner is correct')
        })

        it('lists products', async() =>{    //Test to check if products are listed correctly
            const product = await producttracker.product(productCount)
            assert.equal(product.name, 'Samsung TV','name is correct') 
            assert.equal(product.price,'1000000000000000000','price is correct')
            assert.equal(product.ownerAddress,manufacturer,'owner is correct')
        })

        it('sells products', async() =>{        //Test to check the product purchase functionality
            //Track seller balance before purchase
            let oldSellerBalance
            oldSellerBalance = await web3.eth.getBalance(manufacturer)
            oldSellerBalance = new web3.utils.BN(oldSellerBalance)

            result = await producttracker.buyProduct(productCount,{from: buyer,value: web3.utils.toWei('1','Ether')})
            const event = result.logs[0].args
            assert.equal(event.name, 'Samsung TV','name is correct') 
            assert.equal(event.price,'1000000000000000000','price is correct')
            assert.equal(event.ownerAddress,buyer,'owner is correct')  //Check if owner is updated correctly

            //Check that the seller received funds
            let newSellerBalance
            newSellerBalance = await web3.eth.getBalance(manufacturer)
            newSellerBalance = new web3.utils.BN(newSellerBalance)
 
            let price
            price = web3.utils.toWei('1','Ether')
            price = new web3.utils.BN(price)

           const expectedBalance = oldSellerBalance.add(price)
           assert.equal(newSellerBalance.toString(),expectedBalance.toString())

        })

    })
})
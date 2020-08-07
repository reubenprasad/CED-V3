//SPDX-License-Identifier: MIT
pragma solidity >= 0.5.0 < 0.7.0;

contract ProductTracker {

  address payable public product_manufacturer;   //Address of the manufacturer
  uint public productCount = 0;

  struct productDetail {                         //This struct holds the product details
        uint id;
        string name;
        uint dateOfPurchase;
        uint warrantyPeriod;
        uint price;
        bool used;
        address payable ownerAddress;
    }

  mapping(uint => productDetail) public product;  //Mapping from id to product detail struct

  event ProductAdded(
        uint id,
        string name,
        uint dateOfPurchase,
        uint warrantyPeriod,
        uint price,
        address payable ownerAddress
  );

  event ProductPurchased(                         //Event emitted when product is bought by buyer from manufacturer
        uint id,
        string name,
        uint dateOfPurchase,                      //Date of purchasing product (by buyer) from the manufacturer
        uint warrantyPeriod,                      
        uint price,
        bool used,                                //This is set to true when a buyer re-sells his product using sellProduct, and the item will be listed in the used products section
        address payable ownerAddress
  );

  event ProductListed(                            //Event emitted when used product is listed for sale 
        uint id,
        uint price,
        bool used
  );

   event UsedProductPurchased(                    //Event emitted when a used product is purchased
        uint price,
        bool used,
        address payable buyer
  );

  constructor () public {
   product_manufacturer = msg.sender;             //Set the contract deployer address as product manufacturer 
    }

   modifier only_manufacturer (){
       require (msg.sender == product_manufacturer, "Only manufacturer can add products");
       _;
    }

   modifier buy_conditions (){
       require (msg.sender != product_manufacturer, "Manufacturer cant buy own product");
       _;
    }

   //Function for manufacturer to add new products
   function addProduct(string memory _name, uint _dateOfPurchase,uint _wPeriod, uint _price) public only_manufacturer{
       //Require a valid name
        require(bytes(_name).length > 0, 'name cannot be empty');
       //Require a valid price
        require(_price > 0,'price cannot be 0');
       //Increment the Product Count
        productCount++;
       //Add the Product
        product[productCount] = productDetail(productCount,_name, _dateOfPurchase, _wPeriod, _price, false, product_manufacturer);
       //Emit an event when product is added
        emit ProductAdded(productCount,_name, _dateOfPurchase, _wPeriod, _price, product_manufacturer);

    }

    //Function for buying new products from manufacturer
    function buyProduct(uint _pId) public payable buy_conditions{
        //Fetch the product
        productDetail memory _product = product[_pId];
        //Fetch the owner
        address payable _seller = _product.ownerAddress;
        //Ensure that the product has a valid id
        require(_pId > 0 && _pId <= productCount);
        //Ensure that buyer sends enough ether
        require(msg.value >= _product.price);
        //Transfer the ownership
        _product.ownerAddress = msg.sender;
        //Set date of purchase
        _product.dateOfPurchase = block.timestamp;
        //Update the product
        product[_pId] = _product;
        //Transfer Ether to the seller
        address(_seller).transfer(msg.value);
        //Emit an event
        emit ProductPurchased(_product.id,_product.name, _product.dateOfPurchase, _product.warrantyPeriod, _product.price, _product.used,msg.sender);     
    }

    //Function for buying a used product from another person at the specified price
    function buyUsedProduct(uint _pId) public payable buy_conditions{
        //Fetch the product
        productDetail memory _product = product[_pId];
        //Fetch the owner
        address payable _seller = _product.ownerAddress;
        //Ensure that the product has a valid id
        require(_pId > 0 && _pId <= productCount);
        //Ensure that buyer sends enough ether
        require(msg.value >= _product.price);
        //Transfer the ownership
        _product.ownerAddress = msg.sender;
        //Update the product (reset 'used' value to false)
        _product.used = false;
        product[_pId] = _product;
        //Transfer Ether to the seller
        address(_seller).transfer(msg.value);
        //Emit an event
        emit UsedProductPurchased(_product.price, _product.used,msg.sender);     
    }

    //Function for selling your owned product
    function sellProduct(uint _pId, uint _price) public buy_conditions{
       //Fetch the product
        productDetail memory _product = product[_pId];
        //Ensure that the product has a valid id
        require(_pId > 0 && _pId <= productCount);
        //Ensure that the product is not already listed for sale
        require(!_product.used,'Product already listed');
        //Ensure that the product has a valid id
        require(_pId > 0 && _pId <= productCount);
        //Check if owner is correct
        require(_product.ownerAddress == msg.sender);
        //Update the product
        _product.used = true;
        _product.price = _price;
        product[_pId] = _product;
        emit ProductListed(_product.id, _product.price, _product.used);
    }
}

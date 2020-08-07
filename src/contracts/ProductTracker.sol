//SPDX-License-Identifier: MIT
pragma solidity >= 0.5.0 < 0.7.0;

contract ProductTracker {

  address payable public product_manufacturer;
  uint public productCount = 0;

  struct productDetail {
        uint id;
        string name;
        uint dateOfPurchase;
        uint warrantyPeriod;
        uint price;
        address payable ownerAddress;
    }

  mapping(uint => productDetail) public product;

  event ProductAdded(
        uint id,
        string name,
        uint dateOfPurchase,
        uint warrantyPeriod,
        uint price,
        address payable ownerAddress
  );

  event ProductPurchased(
        uint id,
        string name,
        uint dateOfPurchase,
        uint warrantyPeriod,
        uint price,
        address payable ownerAddress
  );

  constructor () public {
   product_manufacturer = msg.sender;
    }

   modifier only_manufacturer (){
       require (msg.sender == product_manufacturer, "Only manufacturer can add products");
       _;
    }

   modifier buy_conditions (){
       require (msg.sender != product_manufacturer, "Manufacturer cant buy own product");
       _;
    }

   function addProduct(string memory _name, uint _dateOfPurchase,uint _wPeriod, uint _price) public only_manufacturer{
       //Require a valid name
        require(bytes(_name).length > 0, 'name cannot be empty');
       //Require a valid price
        require(_price > 0,'price cannot be 0');
       //Increment the Product Count
        productCount++;
       //Add the Product
        product[productCount] = productDetail(productCount,_name, _dateOfPurchase, _wPeriod, _price, product_manufacturer);
       //Emit an event when product is added
        emit ProductAdded(productCount,_name, _dateOfPurchase, _wPeriod, _price, product_manufacturer);

    }

    function buyProduct(uint _pId) public payable buy_conditions{
        //Fetch the product
        productDetail memory _product = product[_pId];
        //Fetch the owner
        address payable _seller = _product.ownerAddress;
        //Ensure that the product has a valid id
        require(_pId > 0 && _pId <= productCount);
        //Ensure that buyer sends enough ether
        require(msg.value >= _product.price);
        //Ensure that the product has not been purchased already ------------X
        //Transfer the ownership
        _product.ownerAddress = msg.sender;
        //Set date of purchase
        _product.dateOfPurchase = block.timestamp;
        //Update the product
        product[_pId] = _product;
        //Transfer Ether to the seller
        address(_seller).transfer(msg.value);
        //Emit an event
        emit ProductPurchased(_product.id,_product.name, _product.dateOfPurchase, _product.warrantyPeriod, _product.price, msg.sender);     
    }
}

import React, { Component } from 'react';

class Main extends Component {

  render() {
    return (
      <div id="content">
        <h2>Add Product</h2> 
        {/* Add Product Section Start*/}
        <form onSubmit={(event) => {
          event.preventDefault()
          const name = this.productName.value
          const dop = 0;
          const warranty = this.pwarranty.value;
          const price = window.web3.utils.toWei(this.productPrice.value.toString(), 'Ether')
          this.props.addProduct(name,dop,warranty, price)
        }}>
          <div className="form-group mr-sm-2">
            <input
              id="productName"
              type="text"
              ref={(input) => { this.productName = input }}
              className="form-control"
              placeholder="Product Name"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="productPrice"
              type="text"
              ref={(input) => { this.productPrice = input }}
              className="form-control"
              placeholder="Product Price (Ether)"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="pwarranty"
              type="text"
              ref={(input) => { this.pwarranty = input }}
              className="form-control"
              placeholder="Warranty period (Years)"
              required />
          </div>
          <button type="submit" className="btn btn-primary">Add Product</button>
        </form> 
        {/* Add Product Section End*/}
        <p> </p>
        <br></br>
        {/* Buy Product Section Start*/}
        <h2>Buy New Products</h2>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Id</th>
              <th scope="col">Name</th>
              <th scope="col">Price</th>
              <th scope="col">Owner</th>
              <th scope="col">Warranty</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody id="newproductList">
                            { this.props.newproducts.map((product, key) => {
                    return(
                        <tr key={key}>
                        <th scope="row">{product.id.toString()}</th>
                        <td>{product.name}</td>
                        <td>{window.web3.utils.fromWei(product.price.toString(), 'Ether')} Eth</td>
                        <td>{product.ownerAddress}</td>
                        <td>{parseInt(product.warrantyPeriod._hex.toString(16))} years</td>
                        <td>
                            { product.dateOfPurchase==0x00
                            ? <button
                                name={product.id}
                                value={product.price}
                                onClick={(event) => {
                                    this.props.buyProduct(event.target.name, event.target.value)
                                }}
                                >
                                Buy
                                </button>
                            : null
                            }
                            </td>
                        </tr>
                    )
                    })}
          </tbody>
        </table>
        {/* Buy Product Section End*/}
        <br></br>
        <p> </p>
        {/* Buy Used Product Section Start*/}
        <h2>Buy Used Products</h2>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Id</th>
              <th scope="col">Name</th>
              <th scope="col">Price</th>
              <th scope="col">Owner</th>
              <th scope="col">Date of Purchase</th>
              <th scope="col">Warranty</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody id="usedproductList">
                            { this.props.usedproducts.map((product, key) => {
                    return(
                        <tr key={key}>
                        <th scope="row">{product.id.toString()}</th>
                        <td>{product.name}</td>
                        <td>{window.web3.utils.fromWei(product.price.toString(), 'Ether')} Eth</td>
                        <td>{product.ownerAddress}</td>
                        <td>{product.dateOfPurchase}</td>
                        <td>{parseInt(product.warrantyPeriod._hex.toString(16))} years</td>
                        <td>
                            { product.used
                            ? <button
                                name={product.id}
                                value={product.price}
                                onClick={(event) => {
                                    this.props.buyUsedProduct(event.target.name, event.target.value)
                                }}
                                >
                                Buy
                                </button>
                            : null
                            }
                            </td>
                        </tr>
                    )
                    })}
          </tbody>
        </table>
        {/* Buy Used Product Section End*/}
        <br></br>
        <p></p>
        {/* Owned Product Section Start*/}
        <h2>Your Owned Products</h2>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Id</th>
              <th scope="col">Name</th>
              <th scope="col">Price</th>
              <th scope="col">Owner</th>
              <th scope="col">Date of Purchase</th>
              <th scope="col">Warranty</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody id="ownproductList">
                            { this.props.ownproducts.map((product, key) => {
                    return(
                        <tr key={key}>
                        <th scope="row">{product.id.toString()}</th>
                        <td>{product.name}</td>
                        <td>{window.web3.utils.fromWei(product.price.toString(), 'Ether')} Eth</td>
                        <td>{product.ownerAddress}</td>
                        <td>{product.dateOfPurchase}</td>
                        <td>{parseInt(product.warrantyPeriod._hex.toString(16))} years</td>
                        </tr>
                    )
                    })}
          </tbody>
        </table>
        {/* Owned Product Section End*/}
        <br></br>
        <p></p>
        {/* Sell Product Section Start*/}
        <h2>Sell Product</h2>
        <form onSubmit={(event) => {
          event.preventDefault()
          const id = this.productId.value
          const price = window.web3.utils.toWei(this.sellproductPrice.value.toString(), 'Ether')
          this.props.sellProduct(id, price)
        }}>
          <div className="form-group mr-sm-2">
            <input
              id="productId"
              type="text"
              ref={(input) => { this.productId = input }}
              className="form-control"
              placeholder="Product Id"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="sellproductPrice"
              type="text"
              ref={(input) => { this.sellproductPrice = input }}
              className="form-control"
              placeholder="Product Price (Ether)"
              required />
          </div>
          <button type="submit" className="btn btn-primary">Sell Product</button>
        </form>
        {/* Sell Product Section End*/}
        <br></br>
      </div>
    );
  }
}

export default Main;
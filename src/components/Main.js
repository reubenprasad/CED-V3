import React, { Component } from 'react';

class Main extends Component {

  render() {
    return (
      <div id="content">
        <h1>Add Product</h1>
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
              placeholder="Warranty period"
              required />
          </div>
          <button type="submit" className="btn btn-primary">Add Product</button>
        </form>
        <p> </p>
        <h2>Buy Product</h2>
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
          <tbody id="productList">
                            { this.props.products.map((product, key) => {
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
      </div>
    );
  }
}

export default Main;
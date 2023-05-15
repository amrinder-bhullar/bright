import { useEffect, useState } from "react";

function App() {
  const [products, setProducts] = useState();
  const [loading, setLoading] = useState(true);
  const [showCart, setShowCart] = useState(false);
  const [cartData, setCartData] = useState([])

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    if (bannerText) {
      const data = await bannerText;
      await data;
      console.log("data", data, typeof data);
      setProducts(data);
      setLoading(false);
    }
  };

  const addToCart = async (productId) => {
    let formData = {
      items: [
        {
          'id': productId,
          'quantity': 1,
        },
      ],
    };

    console.log(formData)

    const url = window.Shopify.routes.root + "cart/add.js";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    console.log(data);
  };

  const getCartData = async () => {
    const url = window.Shopify.routes.root + "cart.js";

    const response = await fetch(url)
    const data = await response.json();

    setCartData(data);
    setShowCart(true)
    
  }

  return (
    <>
      {!loading && (
        <div
          className="banner-top-inside"
          style={{
            width: "100%",
            backgroundColor: "black",
            color: "white",
            textAlign: "center",
            padding: "10px",
          }}
        >
          {products.map((product) => (
            <>
              <div>{product.title}</div>
              <button onClick={() => addToCart(product.variants[0].id)}>
                add to cart
              </button>
            </>
          ))}
        </div>
      )}
      {showCart && (<div className="cart-box">
        {cartData.items.map(item => (
          <div>
            <span>{item.title}</span>
            <span>{cartData.currency+ ' ' +item.price}</span>
          </div>
        ))}
      </div>)}
      <button onClick={getCartData}>Show Cart</button>
      <button onClick={()=> setShowCart(false)}>close cart</button>
    </>
  );
}

export default App;

import React, { useState, useEffect } from "react";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Drawer } from "antd";
import { Card } from "antd";
const { Meta } = Card;
import { products } from "../data/product";

library.add(fas);

export default function Header() {
  const [open, setOpen] = useState(false);
  const [cart, setCart] = useState([]); // lưu sản phẩm từ local

  useEffect(() => {
    const storedCartItems = localStorage.getItem("cart");
    if (storedCartItems) {
      setCart(JSON.parse(storedCartItems));
    }
  }, [cart]);

  // antd design
  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  // tăng số lượng
  const increaseQuantity = (index) => {
    const updatedCart = [...cart];
    updatedCart[index].quantity++;
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };


  // giảm số lượng
  const decreaseQuantity = (index) => {
    const updatedCart = [...cart];
    if (updatedCart[index].quantity > 1) {
      updatedCart[index].quantity--;
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    }
  };


  // xóa sp trong giỏ hàng
  const removeItem = (index) => {
    const updatedCart = [...cart];
    updatedCart.splice(index, 1); 
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };


// tính tổng giá
  const totalCartPrice = cart.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  return (
    <>
      <div className="Header-container">
        <div>
          <span>Trang chủ</span>
          <span>Danh sách sản phẩm</span>
        </div>
        <div className="cart">
          <FontAwesomeIcon
            icon="fa-solid fa-cart-flatbed"
            onClick={showDrawer}
          />
     
          <Drawer title="CART" onClose={onClose} open={open}>
            {cart.length === 0 ? (
              <p>Không có sản phẩm trong giỏ hàng.</p>
            ) : (
              <>
                {cart.map((item, index) => (
                  <div key={index} className="cart-item">
                    <Card
                      hoverable
                      style={{ width: 240 }}
                      cover={<img alt={item.name} src={item.image} />}
                    >
                      <Meta
                        title={item.name}
                        description={`$${item.price} x ${item.quantity}`}
                      />
                      <div className="quantity-controls">
                        <Button
                          type="primary"
                          shape="circle"
                          icon={<FontAwesomeIcon icon="plus" />}
                          onClick={() => increaseQuantity(index)}
                        />
                        <Button
                          type="primary"
                          shape="circle"
                          icon={<FontAwesomeIcon icon="minus" />}
                          onClick={() => decreaseQuantity(index)}
                        />
                        <Button
                          type="danger"
                          shape="circle"
                          icon={<FontAwesomeIcon icon="times" />}
                          onClick={() => removeItem(index)}
                        />
                      </div>
                    </Card>
                  </div>
                ))}
                <span>Tổng giá: ${totalCartPrice}</span >
              </>
            )}
          </Drawer>
        </div>
      </div>
    </>
  );
}

import React, { useState, useEffect } from 'react';
import { Card } from 'antd';
const { Meta } = Card;
import { products } from "../data/product";

export default function Product() {
    const [cart, setCart] = useState([]);


    // set lên locall
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);


    // thêm sản phẩm vào giỏ hàng
    const addToCart = (product) => {
        const existingIndex = cart.findIndex(item => item.id === product.id);
        if (existingIndex !== -1) {
            const updatedCart = [...cart];
            updatedCart[existingIndex].quantity++;
            setCart(updatedCart);
        } else {
            setCart([...cart, { ...product, quantity: 1 }]);
        }
    };

    return (
        <div className='product'>
            {products.map(product => (
                <div className='item' key={product.id}>
                    <Card
                        hoverable
                        style={{ width: 240, margin: '10px' }}
                        cover={<img alt={product.name} src={product.image} />}
                        actions={[
                            <button key="addToCart" onClick={() => addToCart(product)}>Add to Cart</button>
                        ]}
                    >
                        <Meta title={product.name} description={`$${product.price}`} />
                    </Card>
                </div>
            ))}
        </div>
    );
}

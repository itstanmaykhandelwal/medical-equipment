import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

const CART_STORAGE_KEY = "medical-equipment-cart";

// MongoDB products use _id; static products may use id.
const getProductId = (product) => product?._id ?? product?.id;

const getInitialCart = () => {
    try {
        const savedCart = localStorage.getItem(CART_STORAGE_KEY);
        const parsedCart = savedCart ? JSON.parse(savedCart) : [];

        if (!Array.isArray(parsedCart)) return [];

        return parsedCart
            .filter((item) => getProductId(item) != null)
            .map((item) => ({
                ...item,
                quantity:
                    Number.isInteger(item.quantity) && item.quantity > 0
                        ? item.quantity
                        : 1,
            }));
    } catch {
        return [];
    }
};

export const useCart = () => {
    const context = useContext(CartContext);

    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }

    return context;
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(getInitialCart);

    useEffect(() => {
        try {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
        } catch (error) {
            console.error("Failed to save cart:", error);
        }
    }, [cartItems]);

    const addToCart = (product, quantity = 1) => {
        const productId = getProductId(product);

        if (
            !product ||
            productId == null ||
            !Number.isInteger(quantity) ||
            quantity < 1
        ) {
            return;
        }

        const stock = Number(product.stock);

        if (!Number.isFinite(stock) || stock < 1) {
            return;
        }

        setCartItems((currentItems) => {
            const existingItem = currentItems.find(
                (item) => String(getProductId(item)) === String(productId),
            );

            const currentQuantity = existingItem?.quantity ?? 0;
            const finalQuantity = Math.min(currentQuantity + quantity, stock);

            if (existingItem && finalQuantity === currentQuantity) {
                return currentItems;
            }

            if (existingItem) {
                return currentItems.map((item) =>
                    String(getProductId(item)) === String(productId)
                        ? {
                              ...item,
                              ...product,
                              quantity: finalQuantity,
                          }
                        : item,
                );
            }

            return [
                ...currentItems,
                {
                    ...product,
                    quantity: finalQuantity,
                },
            ];
        });
    };

    const updateQuantity = (productId, quantity) => {
        if (!Number.isInteger(quantity) || quantity < 1) {
            return;
        }

        setCartItems((currentItems) =>
            currentItems.map((item) => {
                if (String(getProductId(item)) !== String(productId)) {
                    return item;
                }

                const stock = Number(item.stock);

                if (!Number.isFinite(stock) || stock < 1) {
                    return item;
                }

                return {
                    ...item,
                    quantity: Math.min(quantity, stock),
                };
            }),
        );
    };

    const removeFromCart = (productId) => {
        setCartItems((currentItems) =>
            currentItems.filter(
                (item) => String(getProductId(item)) !== String(productId),
            ),
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const cartCount = cartItems.reduce(
        (total, item) => total + item.quantity,
        0,
    );

    const cartTotal = cartItems.reduce(
        (total, item) => total + Number(item.price || 0) * item.quantity,
        0,
    );

    return (
        <CartContext.Provider
            value={{
                cartItems,
                cartCount,
                cartTotal,
                addToCart,
                updateQuantity,
                removeFromCart,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export default CartContext;

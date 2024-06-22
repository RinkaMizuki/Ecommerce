import React, { useEffect, useState } from "react";
import ViewTitle from "../ViewTitle";
import useCustomFetch from "../../hooks/useCustomFetch";
import Cart from "../Cart";
import styles from "./ProductRelate.module.scss";
import classNames from "classnames/bind";
import queryString from "query-string";
import Lightbox from "../Lightbox";

const cx = classNames.bind(styles);

const ProductRelate = ({ categoryId, currentId, number }) => {
    const [productId, setProductId] = useState("");
    const [productRelate, setProductRelate] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [getProductRelate] = useCustomFetch();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);

                const filterData = { category: categoryId };
                const queryStringData = queryString.stringify({
                    filter: JSON.stringify(filterData),
                    range: JSON.stringify([0, 11]),
                });

                const response = await getProductRelate(
                    `Admin/products?${queryStringData}`
                );
                setProductRelate(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        // Call the fetchData function
        fetchData();
    }, []);

    const closeLightBox = (id) => {
        setProductId(id);
    };

    return (
        <>
            <ViewTitle
                className={cx("viewtitle-relate")}
                hiddenArrow={true}
                label="Related Product"
            />
            {productRelate?.map((p) => {
                if (p.id == productId) {
                    return (
                        <div style={{ fontFamily: "Poppins" }} key={p.id}>
                            <Lightbox
                                onClose={closeLightBox}
                                url={p.url}
                                alt={p.title}
                            />
                        </div>
                    );
                }
                return null;
            })}
            <div className={cx("container")}>
                {productRelate
                    ?.filter((p) => p.id != currentId)
                    .splice(0, number)
                    .map((p) => (
                        <Cart
                            key={p.id}
                            onCloseLightBox={closeLightBox}
                            data={p}
                        />
                    ))}
            </div>
        </>
    );
};

export default ProductRelate;

import { forwardRef } from "react";
import styles from "./Button.module.scss"
import classNames from "classnames/bind";

const cx = classNames.bind(styles)
const Button = forwardRef(({ onClick, disable = false, to = "", href = "", className, children, small = false, medium = false, lagre = false, ...propsPass }, ref) => {

    const btnClass = cx({
        disable: disable,
        [className]: className,
        btn: true,
        'btn-sm': small,
        'btn-md': medium,
        'btn-lg': lagre
    });


    let Cpn = 'button';

    const props = {
        onClick,
        //Những prop k lường trước được khi nào nó có
        ...propsPass,
    };

    if (to) {
        props.to = to;
        Cpn = Link;
    } else if (href) {
        props.href = href;
        Cpn = 'a';
    } else if (disable) {
        Object.keys(props).forEach((key) => {
            if (key.startsWith('on') && typeof props[key] === 'function') {
                delete props[key];
            }
        });
    }


    return (
        <Cpn className={btnClass} {...props} ref={ref}>
            {children}
        </Cpn>
    )
})
export default Button;
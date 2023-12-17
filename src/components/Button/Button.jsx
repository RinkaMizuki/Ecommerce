import styles from "./Button.module.scss"
import classNames from "classnames/bind";

const cx = classNames.bind(styles)
const Button = ({ className, content, small = false, medium = false, lagre = false }) => {

    const btnClass = cx({
        [className] : className,
        btn: true,
        'btn-sm': small,
        'btn-md': medium,
        'btn-lg': lagre
    });
    return (
        <button className={btnClass}>
            {content}
        </button>
    )
}
export default Button;
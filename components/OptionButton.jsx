import styles from "../styles/OptionButton.module.css";

export function OptionButton ({ title, optionName, bgColor, state, setState, key }) {
    return (
        <button
            className={state == optionName ? styles.selected_option : styles.data_option}
            style={{ backgroundColor: bgColor }}
            onClick={() => setState(optionName)}
            disabled={state == optionName ? true : false}
            key={key}
        >
            {title}
        </button>
    )
}
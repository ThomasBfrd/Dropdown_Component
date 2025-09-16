import {ChangeEvent, RefObject, useEffect, useRef, useState} from "react";
import "./dropdown.scss";
import Caret from "../caret/caret";

export interface DropdownItemProps {
    value: string | number | boolean | Date;
    label: string;
}

export interface DropdownProps {
    placeholder?: string;
    options?: Array<DropdownItemProps>;
    width?: number;
    paddingY?: number;
    paddingX?: number;
    primaryColor?: string;
    secondaryColor?: string;
    backgroundPrimaryColor?: string;
    backgroundSecondaryColor?: string;
    hoverColor?: string;
    itemHoverColor?: string;
    onDropdownItemSelected?: (option: string) => void;
}

const Dropdown = ({
                      options,
                      placeholder = "Select option",
                      width = 150,
                      paddingY = 5,
                      paddingX = 5,
                      primaryColor = "#F8FAFC",
                      secondaryColor = "#1E293B",
                      backgroundPrimaryColor = "#1E293B",
                      backgroundSecondaryColor = "#334155",
                      itemHoverColor = "#475569",
                      hoverColor = "#e4e4e4",
                      onDropdownItemSelected
                  }: DropdownProps) => {

    const [isDropdownOpened, setIsDropdownOpened] = useState<boolean>(false);

    const [dropdownItemSelected, setDropdownItemSelected] = useState<string | null>(null);

    const [optionsFiltered, setOptionsFiltered] = useState<Array<DropdownItemProps>>(options ?? []);

    const dropDownRef: RefObject<HTMLDivElement | null> = useRef<HTMLDivElement | null>(null);

    const dropdownItemRef: RefObject<HTMLDivElement | null> = useRef<HTMLDivElement | null>(null);

    useEffect(() => {

        if (optionsFiltered.length === 0 && options) {
            setOptionsFiltered(options);
        }

        return () => {
        };
    }, [options, optionsFiltered]);

    useEffect(() => {
        if (isDropdownOpened && dropdownItemRef.current) {
            dropdownItemRef.current.scrollIntoView({
                behavior: 'instant',
                block: 'center',
                inline: 'center',
            })
        }
    }, [dropdownItemRef, isDropdownOpened])

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (!dropDownRef.current?.contains(event.target as Node)) {
                setIsDropdownOpened(false);
                setOptionsFiltered([]);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [dropDownRef])

    useEffect(() => {

        document.documentElement.style.setProperty("--dropdown-button-width", width + "px");
        document.documentElement.style.setProperty("--dropdown-button-padding-y", paddingY + "px");
        document.documentElement.style.setProperty("--dropdown-button-padding-x", paddingX + "px");
        document.documentElement.style.setProperty("--dropdown-button-text-primary", primaryColor);
        document.documentElement.style.setProperty("--dropdown-button-text-secondary", secondaryColor);
        document.documentElement.style.setProperty("--dropdown-button-background-primary", backgroundPrimaryColor);
        document.documentElement.style.setProperty("--dropdown-button-background-secondary", backgroundSecondaryColor);
        document.documentElement.style.setProperty("--dropdown-button-item-hover", itemHoverColor);
        document.documentElement.style.setProperty("--dropdown-button-hover", hoverColor);

        return () => {
        }
    }, [width, paddingY, paddingX, primaryColor, secondaryColor, backgroundPrimaryColor, backgroundSecondaryColor, itemHoverColor, hoverColor])

    function handleSetDropdownItemSelected(option: DropdownItemProps) {
        setDropdownItemSelected(option.label);
        setIsDropdownOpened(false);
        setOptionsFiltered([]);

        if (onDropdownItemSelected) {
            onDropdownItemSelected(option.value as string);
        }
    }

    function setDropdownItemToSelect(value: string) {
        if (options && value.length > 0) {
            const regex = /^[a-zA-ZÀ-ÿ0-9 '-]+$/;

            if (!regex.test(value)) {
                return;
            }

            const result = options
                .filter((option: DropdownItemProps) => option.label.toLowerCase().includes(value.toLowerCase()));

            return setOptionsFiltered(result);
        }

        return setOptionsFiltered(options ?? []);
    }

    return (
        <>
            <div className="dropdown-container" ref={dropDownRef}>
                {isDropdownOpened ? (
                    <>
                        <input autoFocus={true}
                            className="dropdown-button opened"
                            placeholder={placeholder}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setDropdownItemToSelect(e.target.value)}
                        >
                        </input>
                        <div className="dropdown-content">
                            {optionsFiltered && optionsFiltered.map((option: DropdownItemProps, index: number) => (
                                <div
                                    className={dropdownItemSelected && dropdownItemSelected === option.value ? 'dropdown-item selected' : 'dropdown-item'}
                                    key={index}
                                    onClick={() => handleSetDropdownItemSelected(option)}
                                    ref={option.value === dropdownItemSelected ? dropdownItemRef : null}

                                >
                                    {option.label}
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className={isDropdownOpened ? "dropdown-button opened" : "dropdown-button"}
                         onClick={() => setIsDropdownOpened(!isDropdownOpened)}>
                        <p>{dropdownItemSelected ? dropdownItemSelected : placeholder}</p>
                        <Caret/>
                    </div>
                )}
            </div>
        </>
    );
};

export default Dropdown;
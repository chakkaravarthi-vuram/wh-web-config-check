import React from 'react';

function EditIcon(props) {
    const {
        className,
        title,
    } = props;

    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <title>{title}</title>
            <g id="edit-02">
                <path id="Icon (Stroke)" fill-rule="evenodd" clip-rule="evenodd" d="M13.5774 1.91075C14.8234 0.66484 16.8434 0.664842 18.0893 1.91075C19.3352 3.15666 19.3352 5.17669 18.0893 6.4226L15.5915 8.92041C15.5907 8.92114 15.59 8.92187 15.5893 8.9226C15.5886 8.92333 15.5878 8.92406 15.5871 8.92478L7.08403 17.4278C7.07006 17.4418 7.05622 17.4557 7.04249 17.4694C6.83841 17.6738 6.65839 17.8541 6.4445 17.9952C6.25645 18.1192 6.05251 18.2172 5.8382 18.2866C5.59444 18.3655 5.34118 18.3934 5.05407 18.4251C5.03476 18.4272 5.0153 18.4294 4.99567 18.4315L2.17536 18.7449C1.92376 18.7729 1.67309 18.6849 1.49408 18.5059C1.31508 18.3269 1.22715 18.0763 1.2551 17.8246L1.56847 15.0043C1.57065 14.9847 1.5728 14.9652 1.57493 14.9459C1.6066 14.6588 1.63453 14.4056 1.71344 14.1618C1.78282 13.9475 1.88084 13.7436 2.00485 13.5555C2.14589 13.3416 2.3262 13.1616 2.53061 12.9575C2.54436 12.9438 2.55822 12.9299 2.57219 12.916L13.5774 1.91075ZM11.6667 6.17852L3.7507 14.0945C3.48195 14.3632 3.43205 14.4187 3.39623 14.473C3.35489 14.5357 3.32222 14.6037 3.29909 14.6751C3.27905 14.737 3.26692 14.8106 3.22494 15.1884L3.02661 16.9734L4.81162 16.7751C5.18937 16.7331 5.26297 16.721 5.32489 16.7009C5.39632 16.6778 5.4643 16.6451 5.52699 16.6038C5.58132 16.568 5.63677 16.5181 5.90552 16.2493L13.8215 8.33334L11.6667 6.17852ZM15 7.15483L12.8452 5.00001L14.756 3.08926C15.351 2.49423 16.3157 2.49423 16.9108 3.08926C17.5058 3.6843 17.5058 4.64905 16.9108 5.24409L15 7.15483Z" fill="#9E9E9E" />
            </g>
        </svg>

    );
}

export default EditIcon;

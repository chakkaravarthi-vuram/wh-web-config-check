import React from 'react';

function DataListSelectorIcon(props) {
  const { className, onClick } = props;
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
      className={className}
    >
      <g>
        <g fill="#959BA3" fillRule="evenodd" clipRule="evenodd">
          <path d="M8.615 1h6.471c.81 0 1.469 0 2.004.044.553.045 1.048.14 1.508.376a3.85 3.85 0 011.683 1.682c.235.46.33.955.376 1.508.043.535.043 1.194.043 2.004v5.736a.85.85 0 01-1.7 0v-5.7c0-.854 0-1.444-.038-1.901-.036-.448-.104-.694-.196-.875a2.15 2.15 0 00-.94-.94c-.18-.092-.427-.16-.874-.196-.458-.037-1.047-.038-1.902-.038h-6.4c-.854 0-1.443 0-1.9.038-.448.037-.695.104-.876.196a2.15 2.15 0 00-.94.94c-.092.18-.159.427-.196.875-.037.457-.038 1.047-.038 1.9v10.4c0 .855.001 1.444.038 1.902.037.448.104.694.197.875.206.405.535.733.94.94.18.092.427.16.874.196.458.037 1.047.038 1.901.038h3.2a.85.85 0 010 1.7H8.615c-.81 0-1.47 0-2.004-.044-.553-.045-1.048-.141-1.508-.376a3.85 3.85 0 01-1.683-1.682c-.235-.46-.33-.956-.376-1.509C3 18.554 3 17.895 3 17.086V6.614c0-.81 0-1.469.044-2.004.045-.553.141-1.047.376-1.508A3.85 3.85 0 015.103 1.42c.46-.235.955-.331 1.508-.376C7.146 1 7.805 1 8.615 1zM7 6.85c0-.47.38-.85.85-.85h8a.85.85 0 010 1.7h-8A.85.85 0 017 6.85zm0 4c0-.47.38-.85.85-.85h6a.85.85 0 010 1.7h-6a.85.85 0 01-.85-.85zm0 4c0-.47.38-.85.85-.85h2a.85.85 0 010 1.7h-2a.85.85 0 01-.85-.85z" />
          <path d="M21.451 15.249a.85.85 0 010 1.202l-4.146 4.146a1.35 1.35 0 01-1.91 0l-2.146-2.146a.85.85 0 111.202-1.202l1.899 1.899 3.899-3.899a.85.85 0 011.202 0z" />
        </g>
      </g>
    </svg>
  );
}

export default DataListSelectorIcon;

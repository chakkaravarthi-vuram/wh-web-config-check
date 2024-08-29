import React from 'react';

function PrivateTeam(props) {
  const { isSelected } = props;
  const iconFill = isSelected ? '#217CF5' : '#959BA3';

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="14"
      viewBox="0 0 24 28"
    >
      <defs>
        <clipPath id="private_team">
          <path d="M1366 0v768H0V0h1366z" />
        </clipPath>
        <clipPath id="private_team_1">
          <path d="M5.455 13.635a10.889 10.889 0 004.011 2.032 9.495 9.495 0 00-1.235 3.817c-.14 1.382.02 2.886.53 4.246a9.69 9.69 0 002.289 3.543l-9.195-.003c-1.16 0-2.013-1.073-1.83-2.209l.61-4.419C1 17.548 2.89 14.96 5.454 13.635zm12 .001a6.546 6.546 0 11-.001 13.092 6.546 6.546 0 010-13.092zm0 2.615c-1.196 0-2.17.973-2.17 2.17v1.12a.77.77 0 00-.61.753v2.484c0 .425.344.77.769.77h4.022a.77.77 0 00.769-.77v-2.484a.77.77 0 00-.611-.753v-1.12c0-1.197-.973-2.17-2.17-2.17zm0 4.432a.68.68 0 01.34 1.27v.757h-.68v-.757a.68.68 0 01.34-1.27zm0-3.3c.572 0 1.037.465 1.037 1.037v1.105h-2.075V18.42c0-.572.466-1.038 1.038-1.038zM12.273 0a6.798 6.798 0 016.818 6.818c0 1.539-.503 2.954-1.354 4.091a9.51 9.51 0 00-6.593 2.633 6.794 6.794 0 01-5.69-6.724A6.798 6.798 0 0112.274 0z" />
        </clipPath>
      </defs>
      <g clipPath="url(#private_team)" transform="translate(-654 -91)">
        <g clipPath="url(#private_team_1)" transform="translate(654 91)">
          <path
            fill={iconFill}
            d="M-2.22044605e-16 0L24 0 24 27.2727273 -2.22044605e-16 27.2727273 -2.22044605e-16 0z"
          />
        </g>
      </g>
    </svg>
  );
}

export default PrivateTeam;

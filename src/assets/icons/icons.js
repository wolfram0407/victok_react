import { color } from "../../styles/theme";

export const DecoIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={5.998} height={6}>
      <defs>
        <clipPath id="a">
          <path
            data-name="\uC0AC\uAC01\uD615 128"
            fill="#fff"
            d="M0 0h5.998v6H0z"
          />
        </clipPath>
      </defs>
      <g data-name="\uADF8\uB8F9 5258" clipPath="url(#a)">
        <path
          data-name="\uD328\uC2A4 3233"
          d="M3 0a3 3 0 0 1-3 2.988A3.019 3.019 0 0 1 3 6a3 3 0 0 1 3-3.012A2.981 2.981 0 0 1 3 0"
          fill="#fff"
        />
      </g>
    </svg>
  );
};

export const LockIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={15} height={16}>
      <g
        data-name="Icon"
        transform="translate(0 .5)"
        fill="none"
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect width={12.6} height={8.2} rx={2} transform="translate(1.5 6.8)" />
        <path d="M4.803 6.8V3.778c0-2.087 1.341-3.778 3-3.778s3 1.691 3 3.778V6.8" />
      </g>
    </svg>
  );
};

export const ChatIcon = ({ isCurrentPage }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16}>
      <path
        data-name="icon"
        d="M15.5 7.583a6.984 6.984 0 0 1-.75 3.167 7.084 7.084 0 0 1-6.333 3.917 6.992 6.992 0 0 1-3.167-.75L.5 15.5l1.583-4.75a6.992 6.992 0 0 1-.75-3.167A7.084 7.084 0 0 1 5.25 1.25 6.984 6.984 0 0 1 8.417.5h.416A7.066 7.066 0 0 1 15.5 7.167Z"
        fill="none"
        stroke={isCurrentPage ? color.mainBlue : color.white}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const SettingIcon = ({ isCurrentPage }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16}>
      <g
        transform="translate(0 -4.717)"
        fill="none"
        stroke={isCurrentPage ? color.mainBlue : color.white}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M13.046 14.763a1.124 1.124 0 0 0 .225 1.241l.041.041a1.364 1.364 0 1 1-1.929 1.929l-.041-.041a1.134 1.134 0 0 0-1.923.8v.116a1.364 1.364 0 0 1-2.727 0v-.061a1.124 1.124 0 0 0-.736-1.029 1.124 1.124 0 0 0-1.241.225l-.041.041a1.364 1.364 0 1 1-1.929-1.929l.041-.041a1.134 1.134 0 0 0-.8-1.922h-.122a1.364 1.364 0 1 1 0-2.727h.061a1.124 1.124 0 0 0 1.029-.736 1.124 1.124 0 0 0-.225-1.244l-.04-.037A1.364 1.364 0 1 1 4.618 7.46l.041.041a1.124 1.124 0 0 0 1.241.225h.054a1.124 1.124 0 0 0 .682-1.03v-.115a1.364 1.364 0 0 1 2.727 0v.061a1.134 1.134 0 0 0 1.923.8l.041-.041a1.364 1.364 0 1 1 1.929 1.929l-.041.041a1.126 1.126 0 0 0-.225 1.241v.054a1.125 1.125 0 0 0 1.03.682h.116a1.364 1.364 0 1 1 0 2.727h-.061a1.124 1.124 0 0 0-1.029.688Z" />
        <circle cx={2} cy={2} r={2} transform="translate(6 10.717)" />
      </g>
    </svg>
  );
};

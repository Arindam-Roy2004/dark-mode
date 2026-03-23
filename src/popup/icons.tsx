import React from 'react';

interface IconProps {
  size?: number;
  color?: string;
  className?: string;
}

// Sun icon from cult-ui (Radix Icons) — used by nolly-studio/cult-ui mode-toggle
export const SunIcon: React.FC<IconProps> = ({ size = 15, color = 'currentColor', className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M7.5 12C7.77614 12 8 12.2239 8 12.5V14.5C8 14.7761 7.77614 15 7.5 15C7.22386 15 7 14.7761 7 14.5V12.5C7 12.2239 7.22386 12 7.5 12ZM3.61133 10.6816C3.80662 10.4868 4.12322 10.4865 4.31836 10.6816C4.5135 10.8768 4.51324 11.1934 4.31836 11.3887L2.90332 12.8037C2.70802 12.9985 2.3914 12.9988 2.19629 12.8037C2.00118 12.6086 2.00147 12.292 2.19629 12.0967L3.61133 10.6816ZM10.6816 10.6816C10.8768 10.4865 11.1934 10.4868 11.3887 10.6816L12.8037 12.0967C12.9985 12.292 12.9988 12.6086 12.8037 12.8037C12.6086 12.9988 12.292 12.9985 12.0967 12.8037L10.6816 11.3887C10.4868 11.1934 10.4865 10.8768 10.6816 10.6816ZM7.5 4.5C9.15685 4.5 10.5 5.84315 10.5 7.5C10.5 9.15685 9.15685 10.5 7.5 10.5C5.84315 10.5 4.5 9.15685 4.5 7.5C4.5 5.84315 5.84315 4.5 7.5 4.5ZM7.5 5.5C6.39543 5.5 5.5 6.39543 5.5 7.5C5.5 8.60457 6.39543 9.5 7.5 9.5C8.60457 9.5 9.5 8.60457 9.5 7.5C9.5 6.39543 8.60457 5.5 7.5 5.5ZM2.5 7C2.77614 7 3 7.22386 3 7.5C3 7.77614 2.77614 8 2.5 8H0.5C0.223858 8 0 7.77614 0 7.5C0 7.22386 0.223858 7 0.5 7H2.5ZM14.5 7C14.7761 7 15 7.22386 15 7.5C15 7.77614 14.7761 8 14.5 8H12.5C12.2239 8 12 7.77614 12 7.5C12 7.22386 12.2239 7 12.5 7H14.5ZM2.19629 2.19629C2.3914 2.00118 2.70802 2.00147 2.90332 2.19629L4.31836 3.61133C4.51324 3.80662 4.5135 4.12322 4.31836 4.31836C4.12322 4.5135 3.80662 4.51324 3.61133 4.31836L2.19629 2.90332C2.00147 2.70802 2.00118 2.3914 2.19629 2.19629ZM12.0967 2.19629C12.292 2.00147 12.6086 2.00118 12.8037 2.19629C12.9988 2.3914 12.9985 2.70802 12.8037 2.90332L11.3887 4.31836C11.1934 4.51324 10.8768 4.5135 10.6816 4.31836C10.4865 4.12322 10.4868 3.80662 10.6816 3.61133L12.0967 2.19629ZM7.5 0C7.77614 0 8 0.223858 8 0.5V2.5C8 2.77614 7.77614 3 7.5 3C7.22386 3 7 2.77614 7 2.5V0.5C7 0.223858 7.22386 0 7.5 0Z"
      fill={color}
    />
  </svg>
);

// Moon icon from cult-ui (Radix Icons) — used by nolly-studio/cult-ui mode-toggle
export const MoonIcon: React.FC<IconProps> = ({ size = 15, color = 'currentColor', className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M8.54431 0.981842L8.8363 1.03458L9.10095 1.09512L9.42517 1.18497L9.6781 1.267L9.95447 1.37051L10.1937 1.47208L10.307 1.52383L10.6342 1.68887L10.9564 1.87442L11.2484 2.06485L11.4926 2.24161L11.8138 2.50235L12.0355 2.70255L12.1957 2.85977L12.3158 2.9838L12.4789 3.16446L12.6781 3.40372L12.8314 3.60391C13.0355 3.88261 13.2175 4.17782 13.3763 4.48672L13.4506 4.63516L13.5277 4.80118L13.641 5.06876C13.7382 5.31392 13.8213 5.56724 13.889 5.82657C13.9452 6.04133 13.9913 6.26068 14.0258 6.4838L14.0619 6.76114C14.0889 7.00372 14.1029 7.25061 14.1029 7.5004C14.1028 11.1454 11.1483 14.1 7.5033 14.1C7.3745 14.1 7.24648 14.0965 7.11951 14.0893L6.85193 14.0688L6.53552 14.0297C6.40721 14.0108 6.27957 13.9885 6.15369 13.9623C6.04742 13.9402 5.9422 13.9151 5.83826 13.8881C5.70144 13.8525 5.5657 13.8131 5.43201 13.769L5.18884 13.683L4.88513 13.5609L4.62537 13.4408L4.36169 13.3061C4.23548 13.2376 4.11156 13.1654 3.9906 13.0893L3.81482 12.974L3.6283 12.8432L3.5072 12.7533L3.31873 12.6049L3.05896 12.3793L2.98669 12.3129C2.91538 12.2459 2.84503 12.1769 2.77673 12.1068C2.62748 11.9531 2.74608 11.7022 2.96033 11.6908C3.20996 11.6774 3.45726 11.65 3.69861 11.6098C6.82221 11.0879 9.20349 8.3718 9.20349 5.10001C9.20345 3.9692 8.91856 2.90436 8.41736 1.97403C8.29975 1.75576 8.17026 1.54482 8.02966 1.34219C7.90722 1.16575 8.03303 0.917893 8.24646 0.941803L8.54431 0.981842ZM9.8324 2.40567C10.2002 3.2979 10.4037 4.27587 10.4037 5.3002C10.4037 5.60452 10.3848 5.90465 10.35 6.19962L10.4779 6.20645C11.108 6.27052 11.5998 6.80261 11.6 7.44962C11.6 8.13996 11.0403 8.6996 10.35 8.69962C10.1081 8.69962 9.88309 8.63005 9.69177 8.51114C9.63529 8.6321 9.57562 8.75117 9.51306 8.86856C9.84841 8.94335 10.099 9.24212 10.099 9.60001C10.0989 10.0141 9.76312 10.35 9.349 10.35C9.09956 10.3499 8.87982 10.2269 8.74353 10.0395C7.81101 11.2068 6.54234 12.0938 5.08337 12.5522C5.81579 12.9036 6.63654 13.1 7.5033 13.1C10.596 13.1 13.1028 10.5931 13.1029 7.5004C13.1029 5.23879 11.7623 3.28958 9.8324 2.40567ZM1.50037 6.10001C1.7211 6.10022 1.90076 6.27961 1.90076 6.5004V7.10001H2.50037L2.58142 7.1088C2.76323 7.14645 2.90076 7.30743 2.90076 7.5004C2.90057 7.69325 2.76319 7.85443 2.58142 7.892L2.50037 7.90079H1.90076V8.5004C1.90055 8.721 1.72097 8.90058 1.50037 8.90079C1.27958 8.90079 1.10019 8.72113 1.09998 8.5004V7.90079H0.500366C0.279583 7.90079 0.100187 7.72113 0.0999756 7.5004C0.0999756 7.27948 0.279452 7.10001 0.500366 7.10001H1.09998V6.5004C1.09998 6.27948 1.27945 6.10001 1.50037 6.10001ZM5.50037 3.10001C5.7211 3.10022 5.90076 3.27961 5.90076 3.5004V4.10001H6.50037L6.58142 4.1088C6.76323 4.14645 6.90076 4.30743 6.90076 4.5004C6.90057 4.69325 6.76319 4.85443 6.58142 4.892L6.50037 4.90079H5.90076V5.5004C5.90055 5.721 5.72097 5.90058 5.50037 5.90079C5.27958 5.90079 5.10019 5.72113 5.09998 5.5004V4.90079H4.50037C4.27958 4.90079 4.10019 4.72113 4.09998 4.5004C4.09998 4.27948 4.27945 4.10001 4.50037 4.10001H5.09998V3.5004C5.09998 3.27948 5.27945 3.10001 5.50037 3.10001ZM2.50037 0.100006C2.7211 0.100218 2.90076 0.279613 2.90076 0.500397V1.10001H3.50037L3.58142 1.1088C3.76323 1.14645 3.90076 1.30743 3.90076 1.5004C3.90057 1.69325 3.76319 1.85443 3.58142 1.892L3.50037 1.90079H2.90076V2.5004C2.90055 2.721 2.72097 2.90058 2.50037 2.90079C2.27958 2.90079 2.10019 2.72113 2.09998 2.5004V1.90079H1.50037C1.27958 1.90079 1.10019 1.72113 1.09998 1.5004C1.09998 1.27948 1.27945 1.10001 1.50037 1.10001H2.09998V0.500397C2.09998 0.279483 2.27945 0.100006 2.50037 0.100006Z"
      fill={color}
    />
  </svg>
);

// Power icon
export const PowerIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" className={className}>
    <path d="M12 2v6" />
    <path d="M8 6.34A8 8 0 1 0 16 6.34" />
  </svg>
);

// Globe icon
export const GlobeIcon: React.FC<IconProps> = ({ size = 14, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" className={className}>
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

// Grid icon (for themes section)
export const GridIcon: React.FC<IconProps> = ({ size = 14, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" className={className}>
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);

// Sliders icon (for adjustments section)
export const SlidersIcon: React.FC<IconProps> = ({ size = 14, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" className={className}>
    <line x1="4" y1="21" x2="4" y2="14" />
    <line x1="4" y1="10" x2="4" y2="3" />
    <line x1="12" y1="21" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12" y2="3" />
    <line x1="20" y1="21" x2="20" y2="16" />
    <line x1="20" y1="12" x2="20" y2="3" />
    <line x1="1" y1="14" x2="7" y2="14" />
    <line x1="9" y1="8" x2="15" y2="8" />
    <line x1="17" y1="16" x2="23" y2="16" />
  </svg>
);

// Check icon
export const CheckIcon: React.FC<IconProps> = ({ size = 14, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M5 12l5 5L20 7" />
  </svg>
);

// Shield icon (for exclude list)
export const ShieldIcon: React.FC<IconProps> = ({ size = 14, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

// X icon (for removing items)
export const XIcon: React.FC<IconProps> = ({ size = 14, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" className={className}>
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

// Plus icon (for adding items)
export const PlusIcon: React.FC<IconProps> = ({ size = 14, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" className={className}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

// Clock icon (for emergency disable timer)
export const ClockIcon: React.FC<IconProps> = ({ size = 14, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
);

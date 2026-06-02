interface BrandMarkProps {
  size?: 'small' | 'medium' | 'large';
}

export function BrandMark({ size = 'medium' }: BrandMarkProps) {
  return (
    <div className={`brand-mark brand-mark--${size}`} aria-hidden="true">
      <span className="brand-mark__bar brand-mark__bar--left" />
      <span className="brand-mark__bar brand-mark__bar--center" />
      <span className="brand-mark__bar brand-mark__bar--right" />
    </div>
  );
}
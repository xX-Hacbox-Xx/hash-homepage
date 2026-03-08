import { forwardRef, useId } from 'react';
import { classes } from '~/utils/style';
import styles from './monogram.module.css';

export const Monogram = forwardRef(({ highlight, className, ...props }, ref) => {
  const id = useId();
  // 1. 使用 Mask 代替 ClipPath
  const maskId = `${id}monogram-mask`;

  return (
    <svg
      aria-hidden
      className={classes(styles.monogram, className)}
      width="32"
      height="32"
      viewBox="0 0 32 32"
      ref={ref}
      {...props}
    >
      <defs>
        {/* 2. 制作一个白色蒙版（在 Mask 里，白色代表完全显示，黑色代表隐藏。所以把你的路径全涂成白色） */}
        <mask id={maskId}>
          <g stroke="#ffffff" fill="#ffffff">
            <path fill="none" d="M30.5999 16.0825L14.0838 19.4355" strokeWidth="2" strokeLinecap="round"/>
            <path fill="none" d="M21.5345 17.8225L23.3054 10.6067" strokeWidth="2" strokeLinecap="round"/>
            <path fill="none" d="M18.1516 3.08105L14.0837 19.4358" strokeWidth="2" strokeLinecap="round"/>
            <path fill="none" d="M15.9406 11.98L23.3054 10.6067" strokeWidth="2" strokeLinecap="round"/>
            <path stroke="none" d="M14.7755 20.1581C14.9755 19.9835 15.0937 19.7393 15.0994 19.4739C15.1053 19.2089 14.9981 18.9446 14.8062 18.7442C14.6143 18.5438 14.3549 18.4252 14.0899 18.4196C13.8246 18.4137 13.5754 18.5212 13.3923 18.7135C13.234 18.8795 13.0756 19.0455 12.9173 19.2115C10.0672 22.1999 7.21701 25.1883 4.36687 28.1767C4.20852 28.3427 4.05018 28.5088 3.89184 28.6748C3.82622 28.7437 3.79036 28.838 3.79041 28.9352C3.79055 29.0326 3.82659 29.1248 3.89234 29.1935C3.95809 29.2621 4.04867 29.3022 4.1459 29.3065C4.24303 29.3108 4.33884 29.2791 4.41051 29.2165C4.58326 29.0655 4.75601 28.9146 4.92876 28.7636C8.03824 26.0461 11.1477 23.3285 14.2572 20.611C14.43 20.4601 14.6027 20.3091 14.7755 20.1581Z" />
          </g>
        </mask>
      </defs>

      {/* 3. 实际渲染的 Logo 图形：强制绑定项目内置的主题变量 var(--textTitle) */}
      <g style={{ stroke: 'var(--textTitle)', fill: 'var(--textTitle)', transition: 'stroke 0.4s ease, fill 0.4s ease' }}>
        <path fill="none" d="M30.5999 16.0825L14.0838 19.4355" strokeWidth="2" strokeLinecap="round"/>
        <path fill="none" d="M21.5345 17.8225L23.3054 10.6067" strokeWidth="2" strokeLinecap="round"/>
        <path fill="none" d="M18.1516 3.08105L14.0837 19.4358" strokeWidth="2" strokeLinecap="round"/>
        <path fill="none" d="M15.9406 11.98L23.3054 10.6067" strokeWidth="2" strokeLinecap="round"/>
        <path stroke="none" d="M14.7755 20.1581C14.9755 19.9835 15.0937 19.7393 15.0994 19.4739C15.1053 19.2089 14.9981 18.9446 14.8062 18.7442C14.6143 18.5438 14.3549 18.4252 14.0899 18.4196C13.8246 18.4137 13.5754 18.5212 13.3923 18.7135C13.234 18.8795 13.0756 19.0455 12.9173 19.2115C10.0672 22.1999 7.21701 25.1883 4.36687 28.1767C4.20852 28.3427 4.05018 28.5088 3.89184 28.6748C3.82622 28.7437 3.79036 28.838 3.79041 28.9352C3.79055 29.0326 3.82659 29.1248 3.89234 29.1935C3.95809 29.2621 4.04867 29.3022 4.1459 29.3065C4.24303 29.3108 4.33884 29.2791 4.41051 29.2165C4.58326 29.0655 4.75601 28.9146 4.92876 28.7636C8.03824 26.0461 11.1477 23.3285 14.2572 20.611C14.43 20.4601 14.6027 20.3091 14.7755 20.1581Z" />
      </g>

      {/* 4. 原版高亮扫光动画：现在使用 mask 进行完美裁切！ */}
      {highlight && (
        <g mask={`url(#${maskId})`}>
          <rect className={styles.highlight} width="100%" height="100%" />
        </g>
      )}
    </svg>
  );
});
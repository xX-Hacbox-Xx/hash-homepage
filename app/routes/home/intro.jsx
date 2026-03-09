import { DecoderText } from '~/components/decoder-text';
import { Heading } from '~/components/heading';
import { Section } from '~/components/section';
import { useTheme } from '~/components/theme-provider';
import { tokens } from '~/components/theme-provider/theme';
import { Transition } from '~/components/transition';
import { VisuallyHidden } from '~/components/visually-hidden';
import { Link as RouterLink } from '@remix-run/react';
import { useInterval, usePrevious, useScrollToHash } from '~/hooks';
import { Suspense, lazy, useEffect, useState } from 'react';
import { cssProps } from '~/utils/style';
import config from '~/config.json';
import { useHydrated } from '~/hooks/useHydrated';
import styles from './intro.module.css';

const DisplacementSphere = lazy(() =>
  import('./displacement-sphere').then(module => ({ default: module.DisplacementSphere }))
);

export function Intro({ id, sectionRef, scrollIndicatorHidden, ...rest }) {
  const { theme } = useTheme();
  const { disciplines } = config;
  const [disciplineIndex, setDisciplineIndex] = useState(0);
  const prevTheme = usePrevious(theme);
  const introLabel = [disciplines.slice(0, -1).join(', '), disciplines.slice(-1)[0]].join(
    ', and '
  );
  const currentDiscipline = disciplines.find((item, index) => index === disciplineIndex);
  const titleId = `${id}-title`;
  const scrollToHash = useScrollToHash();
  const isHydrated = useHydrated();

  useInterval(
    () => {
      const index = (disciplineIndex + 1) % disciplines.length;
      setDisciplineIndex(index);
    },
    5000,
    theme
  );

  useEffect(() => {
    if (prevTheme && prevTheme !== theme) {
      setDisciplineIndex(0);
    }
  }, [theme, prevTheme]);

  const handleScrollClick = event => {
    event.preventDefault();
    scrollToHash(event.currentTarget.href);
  };

  return (
    <Section
      className={styles.intro}
      as="section"
      ref={sectionRef}
      id={id}
      aria-labelledby={titleId}
      tabIndex={-1}
      {...rest}
    >
      <Transition in key={theme} timeout={3000}>
        {({ visible, status }) => (
          <>
            {isHydrated && (
              <Suspense>
                <DisplacementSphere />
              </Suspense>
            )}
            <header className={styles.text}>
              <h1 className={styles.name} data-visible={visible} id={titleId}>
                <DecoderText text={config.name} delay={500} />
              </h1>
              <Heading level={0} as="h2" className={styles.title}>
                <VisuallyHidden className={styles.label}>
                  {`${config.role} + ${introLabel}`}
                </VisuallyHidden>
                
                {/* 仅在客户端渲染核心排版内容，彻底阻断服务器和插件的水合冲突 */}
                {isHydrated ? (
                  <>
                    <span aria-hidden className={styles.row}>
                      <span
                        className={styles.word}
                        data-status={status}
                        style={cssProps({ delay: tokens.base.durationXS })}
                        translate="no" // 告诉翻译插件不要动这个词
                      >
                        {config.role}
                      </span>
                      <span className={styles.line} data-status={status} />
                    </span>
                    
                    {/* 给第二行添加一个最小高度，防止在轮播词切换时由于插件注入标签导致高度坍塌 */}
                    <div className={styles.row} style={{ minHeight: '1.2em' }}>
                      {disciplines.map(item => (
                        <Transition
                          unmount
                          in={item === currentDiscipline}
                          timeout={{ enter: 3000, exit: 2000 }}
                          key={item}
                        >
                          {({ status, nodeRef }) => (
                            <span
                              aria-hidden
                              ref={nodeRef}
                              className={styles.word}
                              data-plus={true}
                              data-status={status}
                              style={cssProps({ delay: tokens.base.durationL })}
                              translate="no" // 保护轮播词不被插件截断
                            >
                              {item}
                            </span>
                          )}
                        </Transition>
                      ))}
                    </div>
                  </>
                ) : (
                  /* 服务器端渲染时的占位符，保持高度一致以防页面跳动 */
                  <>
                    <span aria-hidden className={styles.row}>
                      <span className={styles.word} style={{ opacity: 0 }}>
                        {config.role}
                      </span>
                    </span>
                    <div className={styles.row} style={{ minHeight: '1.2em' }} />
                  </>
                )}
              </Heading>
            </header>
            <RouterLink
              to="/#project-1"
              className={styles.scrollIndicator}
              data-status={status}
              data-hidden={scrollIndicatorHidden}
              onClick={handleScrollClick}
            >
              <VisuallyHidden>Scroll to projects</VisuallyHidden>
            </RouterLink>
            <RouterLink
              to="/#project-1"
              className={styles.mobileScrollIndicator}
              data-status={status}
              data-hidden={scrollIndicatorHidden}
              onClick={handleScrollClick}
            >
              <VisuallyHidden>Scroll to projects</VisuallyHidden>
              <svg
                aria-hidden
                stroke="currentColor"
                width="43"
                height="15"
                viewBox="0 0 43 15"
              >
                <path d="M1 1l20.5 12L42 1" strokeWidth="2" fill="none" />
              </svg>
            </RouterLink>
          </>
        )}
      </Transition>
    </Section>
  );
}

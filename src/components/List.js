import {css} from '@emotion/core';
import {useMemo, useState, useEffect} from 'react';
import {values, mapObjIndexed} from 'ramda';
import throttle from 'lodash.throttle';

const styles = css`
  display: block;

  > .heading {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    padding-bottom: 0;

    > div {
      display: flex;
      flex-direction: column;
    }
  }

  .items {
    display: grid;
    width: 100%;
    grid-template-columns: repeat(1, 1fr);
    grid-gap: 1rem;
    padding: 1rem;
  }

  .no-items {
    display: flex;
    flex: 1;
    text-align: center;
    justify-content: center;
  }

  .footer {
    padding: 1rem;
    padding-top: 0;
  }
`;

// get rid of containerProps!
export default ({
  heading,
  subheading,
  cta,
  columnCountByBreakpoint,
  containerProps = {},
  items,
  noItems,
  footer,
}) => {
  const deps = [heading, subheading, cta];
  const displayHeading = useMemo(() => !!deps.filter(Boolean).length, deps);
  const [renderedItems, addRenderedItems] = useState(items.slice(0, 19));
  const [className, children] = useMemo(
    () =>
      renderedItems && renderedItems.length
        ? ['items', renderedItems]
        : ['no-items', noItems],
    [renderedItems, noItems],
  );

  const displayNextItems = throttle(() => {
    if (renderedItems.length < items.length) {
      addRenderedItems(
        items.slice(renderedItems.lenghth + 1, renderedItems.length + 20),
      );
    }
  }, 1000);

  let lastScrolled = 0;
  const onScroll = e => {
    const scrolled = window.innerHeight + window.pageYOffset;

    if (
      scrolled >= document.body.scrollHeight - 800 &&
      scrolled > lastScrolled
    ) {
      displayNextItems();
    }

    lastScrolled = scrolled;
  };

  useEffect(() => {
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  });

  const responsiveGridStyles = useMemo(
    () =>
      values(
        mapObjIndexed(
          (columnCount, breakpoint) => css`
            @media (min-width: ${breakpoint}px) {
              grid-template-columns: repeat(${columnCount}, 1fr) !important;
            }
          `,
          columnCountByBreakpoint,
        ),
      ),
    [columnCountByBreakpoint],
  );

  return (
    <div css={styles} {...containerProps}>
      {displayHeading && (
        <div className='heading'>
          <div>
            {heading}
            {subheading}
          </div>
          {cta}
        </div>
      )}
      <div css={responsiveGridStyles} {...{className, children}} />
      {footer && <div className='footer'>{footer}</div>}
    </div>
  );
};
